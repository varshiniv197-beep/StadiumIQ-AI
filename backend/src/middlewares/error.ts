import { Request, Response, NextFunction } from 'express';

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
  const timestamp = new Date().toISOString();

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: err.errors || null,
      timestamp
    });
  }

  // Handle SQLite constraint or Prisma error details
  if (err.message.includes('Prisma') || err.name.includes('Prisma')) {
    return res.status(400).json({
      success: false,
      message: 'Database operational constraint violated.',
      data: process.env.NODE_ENV === 'production' ? null : { details: err.message },
      timestamp
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error.',
    data: process.env.NODE_ENV === 'production' ? null : { details: err.message },
    timestamp
  });
};
