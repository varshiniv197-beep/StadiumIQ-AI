import { Request, Response, NextFunction } from 'express';
import { geminiService } from '../services/gemini.service';
import { z } from 'zod';

export const announcementSchema = z.object({
  body: z.object({
    category: z.enum(['EMERGENCY', 'LOST_CHILD', 'WEATHER_DELAY', 'TRAFFIC_ALERT', 'VIP_ARRIVAL', 'MATCH_COUNTDOWN']),
    details: z.string().min(3, 'Announcement details must be specified.'),
    targetLanguage: z.enum(['English', 'Spanish', 'French', 'Arabic', 'Portuguese', 'Hindi', 'Japanese', 'German']).default('Spanish')
  })
});

export class AnnouncementController {
  static async generate(req: Request, res: Response, next: NextFunction) {
    const { category, details, targetLanguage } = req.body;
    try {
      const result = await geminiService.generateAnnouncement(category, details, targetLanguage);
      return res.status(200).json({
        success: true,
        script: result.script,
        translation: result.translation,
        audioPronunciationHint: result.audioPronunciationHint
      });
    } catch (error) {
      return next(error);
    }
  }
}
