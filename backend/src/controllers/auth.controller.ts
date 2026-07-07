import { Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { z } from 'zod';
import { AppError } from '../middlewares/error';
import { RequestWithUser } from '../middlewares/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'FIFA2026_TournamentOperationsSecureTokenKey!';

// Zod Validation Schemas
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
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return next(new AppError(400, 'A user with this email address already exists.'));
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: { email, passwordHash, name, role }
      });

      // Log event
      await prisma.auditLog.create({
        data: {
          userId: newUser.id,
          action: 'USER_SIGNUP',
          details: `User ${name} registered with role ${role}`
        }
      });

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        token,
        user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role }
      });
    } catch (error) {
      return next(error);
    }
  }

  // 2. Login
  static async login(req: RequestWithUser, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return next(new AppError(400, 'Invalid email or password.'));
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return next(new AppError(400, 'Invalid email or password.'));
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Log login
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_LOGIN',
          details: `User ${user.name} logged in.`
        }
      });

      return res.status(200).json({
        success: true,
        message: 'Logged in successfully.',
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role }
      });
    } catch (error) {
      return next(error);
    }
  }

  // 3. Get profile
  static async getProfile(req: RequestWithUser, res: Response, next: NextFunction) {
    if (!req.user) {
      return next(new AppError(401, 'Unauthorized request. Session expired.'));
    }
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, email: true, name: true, role: true, createdAt: true }
      });
      if (!user) {
        return next(new AppError(404, 'User profile not found.'));
      }

      return res.status(200).json({
        success: true,
        user
      });
    } catch (error) {
      return next(error);
    }
  }
}
