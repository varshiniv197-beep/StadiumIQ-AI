import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AppError } from './error';

const JWT_SECRET = process.env.JWT_SECRET || 'FIFA2026_TournamentOperationsSecureTokenKey!';

export interface RequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export const authenticate = (req: RequestWithUser, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError(401, 'Access denied. No token provided.'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
      name: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError(401, 'Invalid authentication token.'));
  }
};

export const hasRole = (allowedRoles: string[]) => {
  return (req: RequestWithUser, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'User session not found.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError(403, 'Permission denied. Unauthorized role.'));
    }

    next();
  };
};
