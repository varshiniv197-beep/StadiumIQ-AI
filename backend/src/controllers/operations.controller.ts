import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { RequestWithUser } from '../middlewares/auth';
import { OperationsService } from '../services/operations.service';
import { sendResponse } from '../utils/response';
import {
  StadiumVenue,
  RecommendationStatus,
  StaffType,
  FeedbackRating,
  Role
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
      const recommendations = await OperationsService.getRecommendations(venue);
      return sendResponse(res, 200, true, 'Recommendations retrieved successfully.', { recommendations });
    } catch (error) {
      return next(error);
    }
  }

  // 2. Implement recommendation action
  static async implementRecommendation(req: RequestWithUser, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { status } = req.body; // 'IMPLEMENTED' | 'IGNORED'
    const userId = req.user?.id || null;
    try {
      const updated = await OperationsService.implementRecommendation(id, status as RecommendationStatus, userId);
      return sendResponse(res, 200, true, 'Recommendation status updated successfully.', { recommendation: updated });
    } catch (error) {
      return next(error);
    }
  }

  // 3. Trigger Scenario Simulation
  static async simulateScenario(req: RequestWithUser, res: Response, next: NextFunction) {
    const { scenario, venue } = req.body;
    const userId = req.user?.id || null;
    try {
      const data = await OperationsService.simulateScenario(scenario, venue as StadiumVenue, userId);
      return sendResponse(res, 200, true, 'Scenario simulation executed successfully.', data);
    } catch (error) {
      return next(error);
    }
  }

  // 4. Resource Optimizer Reallocator (Manual action)
  static async reallocateStaff(req: RequestWithUser, res: Response, next: NextFunction) {
    const { fromZone, toZone, staffType, quantity, reason } = req.body;
    const venue = ((req.query.venue as string) || 'METLIFE_STADIUM') as StadiumVenue;
    const userId = req.user?.id || null;
    try {
      const reallocation = await OperationsService.reallocateStaff(
        venue,
        fromZone,
        toZone,
        staffType as StaffType,
        quantity,
        reason,
        userId
      );
      return sendResponse(res, 201, true, 'Staff reallocated successfully.', { reallocation });
    } catch (error) {
      return next(error);
    }
  }

  // 5. Automated AI Resource Optimization
  static async aiOptimizeResources(req: RequestWithUser, res: Response, next: NextFunction) {
    const venue = ((req.query.venue as string) || 'METLIFE_STADIUM') as StadiumVenue;
    try {
      const data = await OperationsService.aiOptimizeResources(venue);
      return sendResponse(res, 200, true, 'AI resource optimization computed successfully.', data);
    } catch (error) {
      return next(error);
    }
  }

  // 6. Generate Operational Briefing
  static async getBriefing(req: Request, res: Response, next: NextFunction) {
    const venue = ((req.query.venue as string) || 'METLIFE_STADIUM') as StadiumVenue;
    try {
      const brief = await OperationsService.getBriefing(venue);
      return sendResponse(res, 200, true, 'Operational briefing generated successfully.', { brief });
    } catch (error) {
      return next(error);
    }
  }

  // 7. Get Sustainability metrics and AI energy recommendations
  static async getSustainability(req: Request, res: Response, next: NextFunction) {
    const venue = ((req.query.venue as string) || 'METLIFE_STADIUM') as StadiumVenue;
    try {
      const data = await OperationsService.getSustainability(venue);
      return sendResponse(res, 200, true, 'Sustainability analytics retrieved successfully.', data);
    } catch (error) {
      return next(error);
    }
  }

  // 8. Submit AI Feedback
  static async submitFeedback(req: RequestWithUser, res: Response, next: NextFunction) {
    const { recommendationId, rating, comments } = req.body;
    const userRole = (req.user?.role || 'FAN') as Role;
    try {
      const feedback = await OperationsService.submitFeedback(recommendationId, rating as FeedbackRating, comments, userRole);
      return sendResponse(res, 201, true, 'AI feedback submitted successfully.', { feedback });
    } catch (error) {
      return next(error);
    }
  }

  // 9. Get Executive analytics
  static async getExecutiveMetrics(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await OperationsService.getExecutiveMetrics();
      return sendResponse(res, 200, true, 'Executive tournament KPIs retrieved successfully.', { metrics: data });
    } catch (error) {
      return next(error);
    }
  }

  // 10. AI Learning Logs
  static async getLearningCenter(req: Request, res: Response, next: NextFunction) {
    const venue = ((req.query.venue as string) || 'METLIFE_STADIUM') as StadiumVenue;
    try {
      const logs = await OperationsService.getLearningCenter(venue);
      return sendResponse(res, 200, true, 'Operational learning logs retrieved successfully.', { logs });
    } catch (error) {
      return next(error);
    }
  }
}
