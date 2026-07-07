import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { geminiService } from '../services/gemini.service';
import { z } from 'zod';
import { StadiumVenue } from '@prisma/client';

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
      const data = await prisma.crowdTelemetry.findMany({
        where: { venue }
      });
      return res.status(200).json({ success: true, telemetry: data });
    } catch (error) {
      return next(error);
    }
  }

  // 2. Get active Crowd Alerts
  static async getAlerts(req: Request, res: Response, next: NextFunction) {
    const venue = ((req.query.venue as string) || 'METLIFE_STADIUM') as StadiumVenue;
    try {
      const data = await prisma.crowdAlert.findMany({
        where: { venue },
        orderBy: { timestamp: 'desc' }
      });
      return res.status(200).json({ success: true, alerts: data });
    } catch (error) {
      return next(error);
    }
  }

  // 3. Get Crowd Forecast predictions (10m, 20m, 30m, 60m)
  static async getForecast(req: Request, res: Response, next: NextFunction) {
    const venue = ((req.query.venue as string) || 'METLIFE_STADIUM') as StadiumVenue;
    try {
      const telemetry = await prisma.crowdTelemetry.findMany({
        where: { venue }
      });

      // Calculate future congestion based on current states
      const forecast = telemetry.map(t => {
        const currentCongestion = t.congestionLevel;
        // Mock progressive forecasts
        const tenMin = Math.min(1, Math.max(0, currentCongestion + (Math.random() * 0.1 - 0.03)));
        const twentyMin = Math.min(1, Math.max(0, tenMin + (Math.random() * 0.12 - 0.04)));
        const thirtyMin = Math.min(1, Math.max(0, twentyMin + (Math.random() * 0.15 - 0.05)));
        const sixtyMin = Math.min(1, Math.max(0, thirtyMin + (Math.random() * 0.2 - 0.07)));

        return {
          zone: t.zone,
          capacityLimit: t.capacityLimit,
          current: Math.round(t.crowdCount),
          t10: Math.round(t.capacityLimit * tenMin),
          t20: Math.round(t.capacityLimit * twentyMin),
          t30: Math.round(t.capacityLimit * thirtyMin),
          t60: Math.round(t.capacityLimit * sixtyMin),
          congestionTrend: sixtyMin > currentCongestion ? 'INCREASING' : 'STABLE'
        };
      });

      return res.status(200).json({ success: true, forecast });
    } catch (error) {
      return next(error);
    }
  }

  // 4. Explainable AI endpoint
  static async explainRecommendation(req: Request, res: Response, next: NextFunction) {
    const { advice } = req.body;
    const venue = ((req.query.venue as string) || 'METLIFE_STADIUM') as StadiumVenue;
    try {
      const telemetry = await prisma.crowdTelemetry.findMany({ where: { venue } });
      const explanation = await geminiService.explainRecommendation(advice, telemetry);
      return res.status(200).json({ success: true, explanation });
    } catch (error) {
      return next(error);
    }
  }

  // 5. Operations Knowledge Base Q&A
  static async queryKnowledgeBase(req: Request, res: Response, next: NextFunction) {
    const { query } = req.body;
    const venue = ((req.query.venue as string) || 'METLIFE_STADIUM') as StadiumVenue;
    try {
      const telemetry = await prisma.crowdTelemetry.findMany({ where: { venue } });
      const transit = await prisma.transitStatus.findMany({ where: { venue } });

      const answer = await geminiService.answerOperationsQuery(query, telemetry, transit);
      return res.status(200).json({ success: true, answer });
    } catch (error) {
      return next(error);
    }
  }
}
