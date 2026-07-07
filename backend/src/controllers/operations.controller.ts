import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { geminiService } from '../services/gemini.service';
import { z } from 'zod';
import { AppError } from '../middlewares/error';
import { RequestWithUser } from '../middlewares/auth';
import { 
  StadiumVenue, 
  Role, 
  StaffType, 
  Priority, 
  RecommendationStatus, 
  AlertType, 
  IncidentStatus, 
  FeedbackRating 
} from '@prisma/client';

export const simulateSchema = z.object({
  body: z.object({
    scenario: z.enum(['HEAVY_RAIN', 'FIRE_ALERT', 'MEDICAL_EMERGENCY', 'VIP_ARRIVAL', 'STAMPEDE_RISK', 'POWER_OUTAGE']),
    venue: z.enum(['METLIFE_STADIUM', 'ESTADIO_AZTECA', 'BC_PLACE']).default('METLIFE_STADIUM')
  })
});

export const reallocateSchema = z.object({
  body: z.object({
    fromZone: z.string(),
    toZone: z.string(),
    staffType: z.enum(['VOLUNTEER', 'SECURITY', 'MEDICAL', 'CLEANING']),
    quantity: z.number().int().positive(),
    reason: z.string()
  })
});

export const feedbackSchema = z.object({
  body: z.object({
    recommendationId: z.string(),
    rating: z.enum(['HELPFUL', 'NOT_HELPFUL']),
    comments: z.string().optional()
  })
});

export class OperationsController {
  // 1. Get AI recommendations
  static async getRecommendations(req: Request, res: Response, next: NextFunction) {
    const venue = ((req.query.venue as string) || 'METLIFE_STADIUM') as StadiumVenue;
    try {
      const recommendations = await prisma.operationalRecommendation.findMany({
        where: { venue },
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json({ success: true, recommendations });
    } catch (error) {
      return next(error);
    }
  }

  // 2. Implement recommendation action
  static async implementRecommendation(req: RequestWithUser, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { status } = req.body; // 'IMPLEMENTED' | 'IGNORED'
    try {
      const rec = await prisma.operationalRecommendation.findUnique({ where: { id } });
      if (!rec) {
        return next(new AppError(404, 'Recommendation not found.'));
      }

      const updated = await prisma.operationalRecommendation.update({
        where: { id },
        data: { status: status as RecommendationStatus }
      });

      // Audit Log
      await prisma.auditLog.create({
        data: {
          userId: req.user?.id || null,
          action: `REC_${status}`,
          details: `Recommendation ID: ${id} modified to ${status}`
        }
      });

      return res.status(200).json({ success: true, recommendation: updated });
    } catch (error) {
      return next(error);
    }
  }

  // 3. Trigger Scenario Simulation
  static async simulateScenario(req: RequestWithUser, res: Response, next: NextFunction) {
    const { scenario, venue } = req.body;
    try {
      const telemetry = await prisma.crowdTelemetry.findMany({ where: { venue: venue as StadiumVenue } });

      // Trigger Gemini simulated intelligence
      const simulation = await geminiService.simulateScenario(scenario, venue, telemetry);

      // Create a Crowd Alert based on scenario
      const alert = await prisma.crowdAlert.create({
        data: {
          venue: venue as StadiumVenue,
          type: 'INCIDENT' as AlertType,
          severity: 'CRITICAL' as Priority,
          message: `SIMULATED ${scenario}: ${simulation.riskAssessment.substring(0, 100)}`,
          suggestedAction: simulation.actionPlan[0] || 'Observe evacuation guides.'
        }
      });

      // Write Learning Log
      const log = await prisma.learningLog.create({
        data: {
          venue: venue as StadiumVenue,
          eventName: `SIMULATION: ${scenario}`,
          recommendation: simulation.actionPlan.join(' | '),
          humanAction: 'Implemented',
          outcome: 'Evacuation drills and response procedures validated successfully.',
          lessonsLearned: `Ensure emergency exits near ${alert.message} remain free of physical obstructions.`
        }
      });

      return res.status(200).json({
        success: true,
        simulation,
        alert,
        learningLog: log
      });
    } catch (error) {
      return next(error);
    }
  }

  // 4. Resource Optimizer Reallocator (Manual action)
  static async reallocateStaff(req: RequestWithUser, res: Response, next: NextFunction) {
    const { fromZone, toZone, staffType, quantity, reason } = req.body;
    const venue = ((req.query.venue as string) || 'METLIFE_STADIUM') as StadiumVenue;
    try {
      const reallocation = await prisma.staffReallocation.create({
        data: {
          venue,
          fromZone,
          toZone,
          staffType: staffType as StaffType,
          quantity,
          reason
        }
      });

      await prisma.auditLog.create({
        data: {
          userId: req.user?.id || null,
          action: 'STAFF_REALLOCATION',
          details: `Reallocated ${quantity} ${staffType} guards from ${fromZone} to ${toZone}. Reason: ${reason}`
        }
      });

      return res.status(201).json({ success: true, reallocation });
    } catch (error) {
      return next(error);
    }
  }

  // 5. Automated AI Resource Optimization
  static async aiOptimizeResources(req: RequestWithUser, res: Response, next: NextFunction) {
    const venue = ((req.query.venue as string) || 'METLIFE_STADIUM') as StadiumVenue;
    try {
      const telemetry = await prisma.crowdTelemetry.findMany({ where: { venue } });

      // Simulated current staff allocation
      const currentStaff = [
        { zone: 'Gate A', volunteers: 8, security: 5, medical: 1, cleaning: 2 },
        { zone: 'Gate D', volunteers: 4, security: 4, medical: 1, cleaning: 1 },
        { zone: 'VIP Lounge', volunteers: 6, security: 3, medical: 0, cleaning: 2 },
        { zone: 'Food Court East', volunteers: 5, security: 2, medical: 1, cleaning: 4 },
        { zone: 'East Stand', volunteers: 12, security: 8, medical: 2, cleaning: 3 }
      ];

      const optimization = await geminiService.optimizeResources(venue, telemetry, currentStaff);

      // Create record of reallocations in database
      const reallocations = [];
      if (optimization.reallocations && Array.isArray(optimization.reallocations)) {
        for (const item of optimization.reallocations) {
          const rec = await prisma.staffReallocation.create({
            data: {
              venue,
              fromZone: item.fromZone,
              toZone: item.toZone,
              staffType: item.staffType as StaffType,
              quantity: item.quantity,
              reason: item.reason
            }
          });
          reallocations.push(rec);
        }
      }

      return res.status(200).json({
        success: true,
        summary: optimization.summary,
        reallocations
      });
    } catch (error) {
      return next(error);
    }
  }

  // 6. Generate Operational Briefing
  static async getBriefing(req: Request, res: Response, next: NextFunction) {
    const venue = ((req.query.venue as string) || 'METLIFE_STADIUM') as StadiumVenue;
    try {
      const telemetry = await prisma.crowdTelemetry.findMany({ where: { venue } });
      const transit = await prisma.transitStatus.findMany({ where: { venue } });
      const incidents = await prisma.incident.findMany({ where: { venue, status: { not: 'RESOLVED' as IncidentStatus } } });

      const brief = await geminiService.generateOperationalBrief(venue, telemetry, transit, incidents);
      return res.status(200).json({ success: true, brief });
    } catch (error) {
      return next(error);
    }
  }

  // 7. Get Sustainability metrics and AI energy recommendations
  static async getSustainability(req: Request, res: Response, next: NextFunction) {
    const venue = ((req.query.venue as string) || 'METLIFE_STADIUM') as StadiumVenue;
    try {
      const metrics = await prisma.sustainabilityMetric.findFirst({
        where: { venue },
        orderBy: { timestamp: 'desc' }
      });

      // Generate simulated energy recommendations
      const recommendations = [
        { title: 'Dim concourse lighting by 20%', savings: '120 kWh / hr', carbonReduction: '48 kg CO2', type: 'ENERGY' },
        { title: 'Increase HVAC target temperature to 24°C in suites', savings: '340 kWh / hr', carbonReduction: '136 kg CO2', type: 'ENERGY' },
        { title: 'Activate rain-water recycling filters', savings: '4000 Liters / day', carbonReduction: '8 kg CO2', type: 'WATER' }
      ];

      return res.status(200).json({
        success: true,
        metrics,
        recommendations
      });
    } catch (error) {
      return next(error);
    }
  }

  // 8. Submit AI Feedback
  static async submitFeedback(req: RequestWithUser, res: Response, next: NextFunction) {
    const { recommendationId, rating, comments } = req.body;
    const userRole = (req.user?.role || 'FAN') as Role;
    try {
      const feedback = await prisma.aIFeedback.create({
        data: {
          recommendationId,
          userRole,
          rating: rating as FeedbackRating,
          comments
        }
      });
      return res.status(201).json({ success: true, feedback });
    } catch (error) {
      return next(error);
    }
  }

  // 9. Get Executive analytics
  static async getExecutiveMetrics(_req: Request, res: Response, next: NextFunction) {
    try {
      // Aggregate telemetry and incident data across venues
      const totalIncidents = await prisma.incident.count();
      const resolvedIncidents = await prisma.incident.count({ where: { status: 'RESOLVED' as IncidentStatus } });
      const activeIncidents = totalIncidents - resolvedIncidents;

      const sustainabilityMetrics = await prisma.sustainabilityMetric.findMany();
      const totalSolarGen = sustainabilityMetrics.reduce((sum, item) => sum + item.solarGeneration, 0);

      // Return unified tournament dashboard KPIs
      return res.status(200).json({
        success: true,
        metrics: {
          totalIncidents,
          activeIncidents,
          resolvedIncidents,
          totalSolarGen,
          overallSafetyRating: '96.4%',
          volunteerEfficiency: '92.1%',
          overallSustainabilityScore: '89.4%'
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  // 10. AI Learning Logs
  static async getLearningCenter(req: Request, res: Response, next: NextFunction) {
    const venue = ((req.query.venue as string) || 'METLIFE_STADIUM') as StadiumVenue;
    try {
      const logs = await prisma.learningLog.findMany({
        where: { venue },
        orderBy: { timestamp: 'desc' }
      });
      return res.status(200).json({ success: true, logs });
    } catch (error) {
      return next(error);
    }
  }
}
