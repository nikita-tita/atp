import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { redis } from '../index';
import { UserService } from '../services/UserService';
import { JWTPayload, ApiResponse } from '../types';
import logger from '../utils/logger';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      userId?: string;
    }
  }
}

export class AuthMiddleware {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // Verify JWT token
  verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          error: 'Access token required'
        } as ApiResponse);
        return;
      }

      const token = authHeader.substring(7);

      // Check if token is blacklisted
      const isBlacklisted = await redis.get(`blacklist:${token}`);
      if (isBlacklisted) {
        res.status(401).json({
          success: false,
          error: 'Token has been revoked'
        } as ApiResponse);
        return;
      }

      // Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
      
      // Check if user still exists and is active
      const user = await this.userService.getUserById(decoded.sub);
      if (!user || user.status === 'suspended') {
        res.status(401).json({
          success: false,
          error: 'User account is not active'
        } as ApiResponse);
        return;
      }

      req.user = decoded;
      req.userId = decoded.sub;
      next();

    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({
          success: false,
          error: 'Invalid token'
        } as ApiResponse);
      } else if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({
          success: false,
          error: 'Token expired'
        } as ApiResponse);
      } else {
        logger.error('Auth middleware error:', error);
        res.status(500).json({
          success: false,
          error: 'Authentication error'
        } as ApiResponse);
      }
    }
  };

  // Check if user has required role
  requireRole = (requiredRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        } as ApiResponse);
        return;
      }

      const userRoles = req.user.roles;
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

      if (!hasRequiredRole) {
        res.status(403).json({
          success: false,
          error: 'Insufficient permissions'
        } as ApiResponse);
        return;
      }

      next();
    };
  };

  // Check if user has required permission
  requirePermission = (resource: string, action: string) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        } as ApiResponse);
        return;
      }

      try {
        const hasPermission = await this.userService.hasPermission(
          req.user.sub, 
          resource, 
          action
        );

        if (!hasPermission) {
          res.status(403).json({
            success: false,
            error: 'Insufficient permissions'
          } as ApiResponse);
          return;
        }

        next();
      } catch (error) {
        logger.error('Permission check error:', error);
        res.status(500).json({
          success: false,
          error: 'Permission check failed'
        } as ApiResponse);
      }
    };
  };

  // Check verification level
  requireVerificationLevel = (minLevel: number) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        } as ApiResponse);
        return;
      }

      if (req.user.verificationLevel < minLevel) {
        res.status(403).json({
          success: false,
          error: `Verification level ${minLevel} required`
        } as ApiResponse);
        return;
      }

      next();
    };
  };

  // Optional authentication (doesn't fail if no token)
  optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        next();
        return;
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
      
      req.user = decoded;
      req.userId = decoded.sub;
      
    } catch (error) {
      // Ignore errors for optional auth
      logger.debug('Optional auth failed:', error);
    }
    
    next();
  };
}

export const authMiddleware = new AuthMiddleware(); 