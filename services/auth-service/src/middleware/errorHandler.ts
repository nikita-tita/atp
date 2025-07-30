import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { ApiResponse } from '../types';

export const errorHandler = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Unhandled error:', {
    error: error.message,
    stack: error.stack,
    url: _req.url,
    method: _req.method,
    ip: _req.ip,
    userAgent: _req.get('User-Agent')
  });

  // Default error
  let status = 500;
  let message = 'Internal server error';

  // Handle specific error types
  if (error.name === 'ValidationError') {
    status = 400;
    message = 'Validation error';
  } else if (error.name === 'UnauthorizedError') {
    status = 401;
    message = 'Unauthorized';
  } else if (error.name === 'ForbiddenError') {
    status = 403;
    message = 'Forbidden';
  } else if (error.code === '23505') { // PostgreSQL unique constraint violation
    status = 409;
    message = 'Resource already exists';
  } else if (error.code === '23503') { // PostgreSQL foreign key violation
    status = 400;
    message = 'Invalid reference';
  } else if (error.code === '23502') { // PostgreSQL not null violation
    status = 400;
    message = 'Required field missing';
  }

  // Don't expose internal error details in production
  const errorResponse: ApiResponse = {
    success: false,
    error: message
  };

  // Include error details in development
  if (process.env.NODE_ENV === 'development') {
    (errorResponse as any).details = {
      message: error.message,
      stack: error.stack
    };
  }

  res.status(status).json(errorResponse);
}; 