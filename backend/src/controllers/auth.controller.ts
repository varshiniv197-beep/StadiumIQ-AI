import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { RequestWithUser } from '../middlewares/auth';
import { AuthService } from '../services/auth.service';
import { sendResponse } from '../utils/response';

// Zod Validation Schemas (DTO Layer)
export const signupSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    role: z.enum([
      'FAN',
      'ORGANIZER',
      'VOLUNTEER',
      'VENUE_STAFF',
      'SECURITY_OFFICER',
      'TRANSPORT_COORDINATOR',
      'SUSTAINABILITY_MANAGER'
    ]).default('FAN')
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address.'),
    password: z.string()
  })
});

export class AuthController {
  // 1. Sign up
  static async signup(req: RequestWithUser, res: Response, next: NextFunction) {
    const { email, password, name, role } = req.body;
    try {
      const data = await AuthService.signup(email, password, name, role);
      return sendResponse(res, 201, true, 'Account registered successfully.', data);
    } catch (error) {
      return next(error);
    }
  }

  // 2. Login
  static async login(req: RequestWithUser, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const data = await AuthService.login(email, password);
      return sendResponse(res, 200, true, 'Logged in successfully.', data);
    } catch (error) {
      return next(error);
    }
  }

  // 3. Get profile
  static async getProfile(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return sendResponse(res, 401, false, 'Unauthenticated session.');
      }
      const data = await AuthService.getProfile(userId);
      return sendResponse(res, 200, true, 'Profile retrieved successfully.', data);
    } catch (error) {
      return next(error);
    }
  }
}
