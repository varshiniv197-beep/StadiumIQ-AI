import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { geminiService } from '../services/gemini.service';
import { z } from 'zod';
import { AppError } from '../middlewares/error';
import { RequestWithUser } from '../middlewares/auth';
import { StadiumVenue, IncidentCategory, Priority, IncidentStatus, TimelineStage } from '@prisma/client';

export const createIncidentSchema = z.object({
  body: z.object({
    category: z.enum(['FIRE', 'MEDICAL', 'PANIC', 'LOST_CHILD', 'SUSPICIOUS_OBJECT']),
    severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    description: z.string().min(5, 'Description is too short.'),
    location: z.string().min(2, 'Location details are required.')
  })
});

export const updateTimelineSchema = z.object({
  body: z.object({
    stage: z.enum(['REPORTED', 'DISPATCHED', 'RESPONDING', 'RESOLVED', 'LESSONS_LEARNED']),
    description: z.string().min(2, 'Description cannot be empty.')
  })
});

export class IncidentController {
  // 1. Get all incidents for a venue
  static async getIncidents(req: Request, res: Response, next: NextFunction) {
    const venue = ((req.query.venue as string) || 'METLIFE_STADIUM') as StadiumVenue;
    try {
      const incidents = await prisma.incident.findMany({
        where: { venue },
        include: { timeline: true },
        orderBy: { reportedAt: 'desc' }
      });
      return res.status(200).json({ success: true, incidents });
    } catch (error) {
      return next(error);
    }
  }

  // 2. Report a new emergency incident
  static async createIncident(req: RequestWithUser, res: Response, next: NextFunction) {
    const { category, severity, description, location } = req.body;
    const venue = ((req.query.venue as string) || 'METLIFE_STADIUM') as StadiumVenue;
    try {
      // Create Incident in DB
      const newIncident = await prisma.incident.create({
        data: {
          venue,
          category: category as IncidentCategory,
          severity: severity as Priority,
          description,
          location,
          status: 'REPORTED' as IncidentStatus
        }
      });

      // Add first timeline step
      await prisma.incidentTimeline.create({
        data: {
          incidentId: newIncident.id,
          stage: 'REPORTED' as TimelineStage,
          description: `Emergency incident of type ${category} registered at ${location}.`
        }
      });

      // Log in Audit Trail
      await prisma.auditLog.create({
        data: {
          userId: req.user?.id || null,
          action: 'EMERGENCY_TRIGGERED',
          details: `Incident category ${category} reported at ${location} (${severity} severity)`
        }
      });

      // Generate AI Evacuation & Action Plan instantly using Gemini
      const telemetry = await prisma.crowdTelemetry.findMany({ where: { venue } });
      const aiResponse = await geminiService.simulateScenario(`${category}: ${description}`, venue, telemetry);

      return res.status(201).json({
        success: true,
        incident: newIncident,
        aiPlan: aiResponse
      });
    } catch (error) {
      return next(error);
    }
  }

  // 3. Add timeline entry
  static async addTimelineEntry(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { stage, description } = req.body;
    try {
      const incident = await prisma.incident.findUnique({ where: { id } });
      if (!incident) {
        return next(new AppError(404, 'Incident not found.'));
      }

      const timelineItem = await prisma.incidentTimeline.create({
        data: {
          incidentId: id,
          stage: stage as TimelineStage,
          description
        }
      });

      // Update parent status
      let finalStatus = incident.status;
      if (stage === 'RESOLVED') {
        finalStatus = 'RESOLVED';
      } else if (stage === 'RESPONDING') {
        finalStatus = 'RESPONDING';
      } else if (stage === 'DISPATCHED') {
        finalStatus = 'DISPATCHED';
      }

      await prisma.incident.update({
        where: { id },
        data: {
          status: finalStatus as IncidentStatus,
          resolvedAt: stage === 'RESOLVED' ? new Date() : incident.resolvedAt
        }
      });

      // Write learning log if incident resolved
      if (stage === 'RESOLVED') {
        await prisma.learningLog.create({
          data: {
            venue: incident.venue,
            eventName: `Incident ID: ${incident.id.substring(0, 8)} (${incident.category})`,
            recommendation: `Deploy security personnel to ${incident.location}`,
            humanAction: 'Implemented',
            outcome: 'Incident resolved with minimal corridor disruptions.',
            lessonsLearned: `Review dispatch latencies for ${incident.category} in ${incident.location}. Add local signs.`
          }
        });
      }

      return res.status(201).json({
        success: true,
        timelineItem
      });
    } catch (error) {
      return next(error);
    }
  }
}
