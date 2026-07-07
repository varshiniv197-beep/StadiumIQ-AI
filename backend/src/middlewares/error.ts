import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/response';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed.') {
    super(401, message);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed.', errors?: any) {
    super(400, message, errors);
  }
}

export class DatabaseError extends AppError {
  constructor(message = 'Database query failed.') {
    super(500, message);
  }
}

export class AIServiceError extends AppError {
  constructor(message = 'AI Generation model failed.') {
    super(502, message);
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return ApiResponse.error(res, err.message, err.errors || null, err.statusCode);
  }

  // Handle SQLite constraint or Prisma error details
  if (err.message.includes('Prisma') || err.name.includes('Prisma')) {
    return ApiResponse.error(
      res,
      'Database operational constraint violated.',
      process.env.NODE_ENV === 'production' ? null : { details: err.message },
      400
    );
  }

  return ApiResponse.error(
    res,
    'Internal server error.',
    process.env.NODE_ENV === 'production' ? null : { details: err.message },
    500
  );
};
