import { Request, Response, NextFunction } from 'express';
import { StadiumVenue } from '@prisma/client';
import { CrowdService } from '../services/crowd.service';
import { sendResponse } from '../utils/response';
import { z } from 'zod';

export const explainSchema = z.object({
  body: z.object({
    advice: z.string().min(3, 'Advice description is required.')
  })
});

export const kbSchema = z.object({
  body: z.object({
    query: z.string().min(2, 'Query cannot be empty.')
  })
});

export class CrowdController {
  // 1. Get Live Crowd Telemetry
  static async getTelemetry(req: Request, res: Response, next: NextFunction) {
    const venue = ((req.query.venue as string) || 'METLIFE_STADIUM') as StadiumVenue;
    try {
      const data = await CrowdService.getTelemetry(venue);
      return sendResponse(res, 200, true, 'Crowd telemetry retrieved successfully.', { telemetry: data });
    } catch (error) {
      return next(error);
    }
  }

  // 2. Get active Crowd Alerts
  static async getAlerts(req: Request, res: Response, next: NextFunction) {
    const venue = ((req.query.venue as string) || 'METLIFE_STADIUM') as StadiumVenue;
    try {
      const data = await CrowdService.getAlerts(venue);
      return sendResponse(res, 200, true, 'Crowd alerts retrieved successfully.', { alerts: data });
    } catch (error) {
      return next(error);
    }
  }

  // 3. Get Crowd Forecast predictions (10m, 20m, 30m, 60m)
  static async getForecast(req: Request, res: Response, next: NextFunction) {
    const venue = ((req.query.venue as string) || 'METLIFE_STADIUM') as StadiumVenue;
    try {
      const forecast = await CrowdService.getForecast(venue);
      return sendResponse(res, 200, true, 'Crowd forecasts generated successfully.', { forecast });
    } catch (error) {
      return next(error);
    }
  }

  // 4. Explainable AI endpoint
  static async explainRecommendation(req: Request, res: Response, next: NextFunction) {
    const { advice } = req.body;
    const venue = ((req.query.venue as string) || 'METLIFE_STADIUM') as StadiumVenue;
    try {
      const explanation = await CrowdService.explainRecommendation(advice, venue);
      return sendResponse(res, 200, true, 'Recommendation explanation generated successfully.', { explanation });
    } catch (error) {
      return next(error);
    }
  }

  // 5. Operations Knowledge Base Q&A
  static async queryKnowledgeBase(req: Request, res: Response, next: NextFunction) {
    const { query } = req.body;
    const venue = ((req.query.venue as string) || 'METLIFE_STADIUM') as StadiumVenue;
    try {
      const answer = await CrowdService.queryKnowledgeBase(query, venue);
      return sendResponse(res, 200, true, 'Knowledge base query executed successfully.', { answer });
    } catch (error) {
      return next(error);
    }
  }
}
