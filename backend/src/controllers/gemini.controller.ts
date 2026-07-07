import { Request, Response, NextFunction } from 'express';
import { geminiService } from '../services/gemini.service';
import { z } from 'zod';

export const chatSchema = z.object({
  body: z.object({
    message: z.string().min(1, 'Message is required.'),
    history: z.array(z.object({
      role: z.enum(['user', 'model']),
      text: z.string()
    })).default([]),
    language: z.string().default('English')
  })
});

export class GeminiController {
  static async chat(req: Request, res: Response, next: NextFunction) {
    const { message, history, language } = req.body;
    try {
      const response = await geminiService.generateChatResponse(message, history, language);
      return res.status(200).json({
        success: true,
        response
      });
    } catch (error) {
      return next(error);
    }
  }
}
