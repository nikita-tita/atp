import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { UserService } from '../services/UserService';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { UserType, ApiResponse, UserRegistrationData, UserLoginData } from '../types';
import logger from '../utils/logger';

const router = Router();
const userService = new UserService();

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]')).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    'any.required': 'Password is required'
  }),
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  companyName: Joi.string().min(2).max(255).optional(),
  phone: Joi.string().pattern(new RegExp('^[+]?[1-9]\\d{1,14}$')).optional().messages({
    'string.pattern.base': 'Please provide a valid phone number'
  }),
  userType: Joi.string().valid(...Object.values(UserType)).required().messages({
    'any.only': 'User type must be one of: buyer, seller, broker, admin',
    'any.required': 'User type is required'
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]')).required().messages({
    'string.min': 'New password must be at least 8 characters long',
    'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  })
});

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', validateRequest(registerSchema), async (req: Request, res: Response) => {
  try {
    const userData: UserRegistrationData = req.body;
    
    const user = await userService.registerUser(userData);
    
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          companyName: user.companyName,
          phone: user.phone,
          userType: user.userType,
          status: user.status,
          verificationLevel: user.verificationLevel,
          roles: user.roles,
          createdAt: user.createdAt
        }
      },
      message: 'User registered successfully. Please check your email for verification instructions.'
    } as ApiResponse);

  } catch (error: any) {
    logger.error('Registration error:', error);
    
    if (error.message === 'User with this email already exists') {
      res.status(409).json({
        success: false,
        error: error.message
      } as ApiResponse);
    } else {
      res.status(400).json({
        success: false,
        error: 'Registration failed. Please try again.'
      } as ApiResponse);
    }
  }
});

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', validateRequest(loginSchema), async (req: Request, res: Response) => {
  try {
    const loginData: UserLoginData = req.body;
    
    const { user, tokens } = await userService.loginUser(loginData);
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          companyName: user.companyName,
          phone: user.phone,
          userType: user.userType,
          status: user.status,
          verificationLevel: user.verificationLevel,
          roles: user.roles,
          permissions: user.permissions,
          lastLogin: user.lastLogin
        },
        tokens
      },
      message: 'Login successful'
    } as ApiResponse);

  } catch (error: any) {
    logger.error('Login error:', error);
    
    if (error.message === 'Invalid email or password' || error.message === 'Account is suspended') {
      res.status(401).json({
        success: false,
        error: error.message
      } as ApiResponse);
    } else {
      res.status(500).json({
        success: false,
        error: 'Login failed. Please try again.'
      } as ApiResponse);
    }
  }
});

/**
 * @route POST /api/auth/refresh
 * @desc Refresh access token
 * @access Public
 */
router.post('/refresh', validateRequest(refreshTokenSchema), async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    
    const tokens = await userService.refreshToken(refreshToken);
    
    res.json({
      success: true,
      data: { tokens },
      message: 'Token refreshed successfully'
    } as ApiResponse);

  } catch (error: any) {
    logger.error('Token refresh error:', error);
    
    res.status(401).json({
      success: false,
      error: 'Invalid or expired refresh token'
    } as ApiResponse);
  }
});

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Private
 */
router.post('/logout', authMiddleware.verifyToken, async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.substring(7); // Remove 'Bearer '
    const { refreshToken } = req.body;
    
    if (accessToken) {
      await userService.logoutUser(accessToken, refreshToken);
    }
    
    res.json({
      success: true,
      message: 'Logout successful'
    } as ApiResponse);

  } catch (error: any) {
    logger.error('Logout error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Logout failed'
    } as ApiResponse);
  }
});

/**
 * @route GET /api/auth/profile
 * @desc Get user profile
 * @access Private
 */
router.get('/profile', authMiddleware.verifyToken, async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.userId!);
    
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      } as ApiResponse);
      return;
    }
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          companyName: user.companyName,
          phone: user.phone,
          userType: user.userType,
          status: user.status,
          verificationLevel: user.verificationLevel,
          roles: user.roles,
          permissions: user.permissions,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastLogin: user.lastLogin
        }
      }
    } as ApiResponse);

  } catch (error: any) {
    logger.error('Get profile error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to get user profile'
    } as ApiResponse);
  }
});

/**
 * @route PUT /api/auth/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/profile', authMiddleware.verifyToken, async (req: Request, res: Response) => {
  try {
    const updateData = req.body;
    
    // Remove sensitive fields
    delete updateData.password;
    delete updateData.email;
    delete updateData.userType;
    delete updateData.status;
    delete updateData.verificationLevel;
    
    const updatedUser = await userService.updateUserProfile(req.userId!, updateData);
    
    res.json({
      success: true,
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          companyName: updatedUser.companyName,
          phone: updatedUser.phone,
          userType: updatedUser.userType,
          status: updatedUser.status,
          verificationLevel: updatedUser.verificationLevel,
          roles: updatedUser.roles,
          updatedAt: updatedUser.updatedAt
        }
      },
      message: 'Profile updated successfully'
    } as ApiResponse);

  } catch (error: any) {
    logger.error('Update profile error:', error);
    
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update profile'
    } as ApiResponse);
  }
});

/**
 * @route POST /api/auth/change-password
 * @desc Change user password
 * @access Private
 */
router.post('/change-password', 
  authMiddleware.verifyToken, 
  validateRequest(changePasswordSchema), 
  async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      await userService.changePassword(req.userId!, currentPassword, newPassword);
      
      res.json({
        success: true,
        message: 'Password changed successfully'
      } as ApiResponse);

    } catch (error: any) {
      logger.error('Change password error:', error);
      
      if (error.message === 'Current password is incorrect') {
        res.status(400).json({
          success: false,
          error: error.message
        } as ApiResponse);
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to change password'
        } as ApiResponse);
      }
    }
  }
);

/**
 * @route GET /api/auth/verify
 * @desc Verify token (used by API Gateway)
 * @access Public
 */
router.get('/verify', authMiddleware.verifyToken, async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      userId: req.userId,
      userRoles: req.user?.roles,
      verificationLevel: req.user?.verificationLevel
    }
  } as ApiResponse);
});

export const authRoutes = router; 