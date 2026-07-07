import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { StadiumVenue } from '@prisma/client';

export class TransitController {
  // 1. Get Transit Status and Parking availability
  static async getStatus(req: Request, res: Response, next: NextFunction) {
    const venue = ((req.query.venue as string) || 'METLIFE_STADIUM') as StadiumVenue;
    try {
      const transitData = await prisma.transitStatus.findMany({
        where: { venue }
      });
      return res.status(200).json({
        success: true,
        transit: transitData
      });
    } catch (error) {
      return next(error);
    }
  }

  // 2. Fetch travel recommendations using historical delays
  static async getTravelRecommendations(req: Request, res: Response, next: NextFunction) {
    const venue = ((req.query.venue as string) || 'METLIFE_STADIUM') as StadiumVenue;
    try {
      const transitData = await prisma.transitStatus.findMany({
        where: { venue }
      });

      const delayedLines = transitData.filter(t => t.status !== 'ON_TIME');
      let generalRecommendation = 'All major public transit lines are operating smoothly. We recommend taking the light rail for lowest carbon footprint.';

      if (delayedLines.length > 0) {
        const linesStr = delayedLines.map(d => `${d.lineName} (${d.delayMinutes}m delay)`).join(', ');
        generalRecommendation = `Delays detected on: ${linesStr}. We recommend switching to official Shuttle Buses or scheduling a Rideshare to Lot C. Check walking paths for crowd delays.`;
      }

      return res.status(200).json({
        success: true,
        recommendation: generalRecommendation,
        delayedLinesCount: delayedLines.length
      });
    } catch (error) {
      return next(error);
    }
  }
}
