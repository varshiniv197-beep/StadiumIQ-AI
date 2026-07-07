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

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('[ErrorHandler] Caught exception:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors
    });
  }

  // Handle SQLite constraint or Prisma error details
  if (err.message.includes('Prisma') || err.name.includes('Prisma')) {
    return res.status(400).json({
      success: false,
      message: 'Database operational constraint violated.',
      error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error.',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
};
