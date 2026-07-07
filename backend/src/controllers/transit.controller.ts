import { Request, Response, NextFunction } from 'express';
import { StadiumVenue } from '@prisma/client';
import { TransitService } from '../services/transit.service';
import { sendResponse } from '../utils/response';

export class TransitController {
  // 1. Get Transit Status and Parking availability
  static async getStatus(req: Request, res: Response, next: NextFunction) {
    const venue = ((req.query.venue as string) || 'METLIFE_STADIUM') as StadiumVenue;
    try {
      const transitData = await TransitService.getStatus(venue);
      return sendResponse(res, 200, true, 'Transit status retrieved successfully.', { transit: transitData });
    } catch (error) {
      return next(error);
    }
  }

  // 2. Fetch travel recommendations using historical delays
  static async getTravelRecommendations(req: Request, res: Response, next: NextFunction) {
    const venue = ((req.query.venue as string) || 'METLIFE_STADIUM') as StadiumVenue;
    try {
      const data = await TransitService.getTravelRecommendations(venue);
      return sendResponse(res, 200, true, 'Transit recommendations retrieved successfully.', data);
    } catch (error) {
      return next(error);
    }
  }
}
