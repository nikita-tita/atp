import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { UserService } from '../services/UserService';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { UserStatus, ApiResponse } from '../types';
import logger from '../utils/logger';
import { db } from '../index';

const router = Router();
const userService = new UserService();

// Validation schemas
const updateUserStatusSchema = Joi.object({
  status: Joi.string().valid(...Object.values(UserStatus)).required(),
  reason: Joi.string().max(500).optional()
});

const updateVerificationLevelSchema = Joi.object({
  verificationLevel: Joi.number().integer().min(0).max(3).required(),
  reason: Joi.string().max(500).optional()
});

/**
 * @route GET /api/users
 * @desc Get all users (Admin only)
 * @access Private (Admin)
 */
router.get('/', 
  authMiddleware.verifyToken,
  authMiddleware.requireRole(['admin']),
  async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = (page - 1) * limit;
      
      const status = req.query.status as UserStatus;
      const userType = req.query.userType as string;
      const search = req.query.search as string;

      let whereClause = 'WHERE 1=1';
      const queryParams: any[] = [];
      let paramIndex = 1;

      if (status) {
        whereClause += ` AND u.status = $${paramIndex++}`;
        queryParams.push(status);
      }

      if (userType) {
        whereClause += ` AND u.user_type = $${paramIndex++}`;
        queryParams.push(userType);
      }

      if (search) {
        whereClause += ` AND (u.email ILIKE $${paramIndex++} OR u.first_name ILIKE $${paramIndex++} OR u.last_name ILIKE $${paramIndex++} OR u.company_name ILIKE $${paramIndex++})`;
        const searchPattern = `%${search}%`;
        queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
      }

      // Get total count
      const countResult = await db.query(`
        SELECT COUNT(*) as total
        FROM users u
        ${whereClause}
      `, queryParams);

      const total = parseInt(countResult.rows[0].total);

      // Get users
      const usersResult = await db.query(`
        SELECT 
          u.id, u.email, u.first_name, u.last_name, u.company_name, u.phone,
          u.status, u.user_type, u.verification_level, u.created_at, u.updated_at, u.last_login,
          COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT('id', r.id, 'name', r.name, 'description', r.description)
            ) FILTER (WHERE r.id IS NOT NULL), 
            '[]'
          ) as roles
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        ${whereClause}
        GROUP BY u.id, u.email, u.first_name, u.last_name, u.company_name, u.phone,
                 u.status, u.user_type, u.verification_level, u.created_at, u.updated_at, u.last_login
        ORDER BY u.created_at DESC
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `, [...queryParams, limit, offset]);

      res.json({
        success: true,
        data: {
          users: usersResult.rows,
          pagination: {
            current: page,
            total: Math.ceil(total / limit),
            count: usersResult.rows.length,
            totalCount: total
          }
        }
      } as ApiResponse);

    } catch (error: any) {
      logger.error('Get users error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get users'
      } as ApiResponse);
    }
  }
);

/**
 * @route GET /api/users/:userId
 * @desc Get user by ID (Admin only)
 * @access Private (Admin)
 */
router.get('/:userId', 
  authMiddleware.verifyToken,
  authMiddleware.requireRole(['admin']),
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      
      const user = await userService.getUserById(userId);
      
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        } as ApiResponse);
        return;
      }
      
      res.json({
        success: true,
        data: { user }
      } as ApiResponse);

    } catch (error: any) {
      logger.error('Get user by ID error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user'
      } as ApiResponse);
    }
  }
);

/**
 * @route PUT /api/users/:userId/status
 * @desc Update user status (Admin only)
 * @access Private (Admin)
 */
router.put('/:userId/status', 
  authMiddleware.verifyToken,
  authMiddleware.requireRole(['admin']),
  validateRequest(updateUserStatusSchema),
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { status, reason } = req.body;
      
      // Check if user exists
      const user = await userService.getUserById(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        } as ApiResponse);
        return;
      }

      // Prevent admin from suspending themselves
      if (req.userId === userId && status === UserStatus.SUSPENDED) {
        res.status(400).json({
          success: false,
          error: 'Cannot suspend your own account'
        } as ApiResponse);
        return;
      }
      
      // Update user status
      await db.query(
        'UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2',
        [status, userId]
      );

      // Log status change
      await db.query(`
        INSERT INTO user_status_logs (user_id, old_status, new_status, changed_by, reason, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
      `, [userId, user.status, status, req.userId, reason || null]);
      
      res.json({
        success: true,
        message: `User status updated to ${status}`
      } as ApiResponse);

    } catch (error: any) {
      logger.error('Update user status error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update user status'
      } as ApiResponse);
    }
  }
);

/**
 * @route PUT /api/users/:userId/verification-level
 * @desc Update user verification level (Admin only)
 * @access Private (Admin)
 */
router.put('/:userId/verification-level', 
  authMiddleware.verifyToken,
  authMiddleware.requireRole(['admin']),
  validateRequest(updateVerificationLevelSchema),
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { verificationLevel, reason } = req.body;
      
      // Check if user exists
      const user = await userService.getUserById(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        } as ApiResponse);
        return;
      }
      
      // Update verification level
      await db.query(
        'UPDATE users SET verification_level = $1, updated_at = NOW() WHERE id = $2',
        [verificationLevel, userId]
      );

      // Log verification level change
      await db.query(`
        INSERT INTO verification_level_logs (user_id, old_level, new_level, changed_by, reason, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
      `, [userId, user.verificationLevel, verificationLevel, req.userId, reason || null]);
      
      res.json({
        success: true,
        message: `User verification level updated to ${verificationLevel}`
      } as ApiResponse);

    } catch (error: any) {
      logger.error('Update verification level error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update verification level'
      } as ApiResponse);
    }
  }
);

/**
 * @route GET /api/users/stats/summary
 * @desc Get user statistics (Admin only)
 * @access Private (Admin)
 */
router.get('/stats/summary', 
  authMiddleware.verifyToken,
  authMiddleware.requireRole(['admin']),
  async (req: Request, res: Response) => {
    try {
      const statsResult = await db.query(`
        SELECT 
          COUNT(*) as total_users,
          COUNT(*) FILTER (WHERE status = 'verified') as verified_users,
          COUNT(*) FILTER (WHERE status = 'pending') as pending_users,
          COUNT(*) FILTER (WHERE status = 'suspended') as suspended_users,
          COUNT(*) FILTER (WHERE user_type = 'buyer') as buyers,
          COUNT(*) FILTER (WHERE user_type = 'seller') as sellers,
          COUNT(*) FILTER (WHERE user_type = 'broker') as brokers,
          COUNT(*) FILTER (WHERE verification_level >= 1) as level_1_verified,
          COUNT(*) FILTER (WHERE verification_level >= 2) as level_2_verified,
          COUNT(*) FILTER (WHERE verification_level >= 3) as level_3_verified,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_users_30_days,
          COUNT(*) FILTER (WHERE last_login >= NOW() - INTERVAL '7 days') as active_users_7_days
        FROM users
      `);

      res.json({
        success: true,
        data: {
          stats: statsResult.rows[0]
        }
      } as ApiResponse);

    } catch (error: any) {
      logger.error('Get user stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user statistics'
      } as ApiResponse);
    }
  }
);

export const userRoutes = router; 