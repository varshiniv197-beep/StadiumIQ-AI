import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { RequestWithUser } from '../middlewares/auth';
import { IncidentService } from '../services/incident.service';
import { sendResponse } from '../utils/response';
import { StadiumVenue, IncidentCategory, Priority, TimelineStage } from '@prisma/client';

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
      const incidents = await IncidentService.getIncidents(venue);
      return sendResponse(res, 200, true, 'Incidents retrieved successfully.', { incidents });
    } catch (error) {
      return next(error);
    }
  }

  // 2. Report a new emergency incident
  static async createIncident(req: RequestWithUser, res: Response, next: NextFunction) {
    const { category, severity, description, location } = req.body;
    const venue = ((req.query.venue as string) || 'METLIFE_STADIUM') as StadiumVenue;
    const userId = req.user?.id || null;
    try {
      const data = await IncidentService.createIncident(
        venue,
        category as IncidentCategory,
        severity as Priority,
        description,
        location,
        userId
      );
      return sendResponse(res, 201, true, 'Emergency incident reported successfully.', data);
    } catch (error) {
      return next(error);
    }
  }

  // 3. Add timeline entry
  static async addTimelineEntry(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { stage, description } = req.body;
    try {
      const timelineItem = await IncidentService.addTimelineEntry(
        id,
        stage as TimelineStage,
        description
      );
      return sendResponse(res, 201, true, 'Incident timeline entry added successfully.', { timelineItem });
    } catch (error) {
      return next(error);
    }
  }
}
