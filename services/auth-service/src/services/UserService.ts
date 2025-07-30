import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
// import { Pool } from 'pg';
import { db, redis } from '../index';
import { 
  // User, 
  UserRegistrationData, 
  UserLoginData, 
  UserWithRoles, 
  AuthTokens, 
  JWTPayload,
  UserStatus,
  UserType 
} from '../types';
import logger from '../utils/logger';

export class UserService {
  private readonly saltRounds = 12;
  private readonly accessTokenExpiry = '1h';
  private readonly refreshTokenExpiry = '7d';

  // Register new user
  async registerUser(userData: UserRegistrationData): Promise<UserWithRoles> {
    const client = await db.connect();
    
    try {
      await client.query('BEGIN');

      // Check if user already exists
      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [userData.email.toLowerCase()]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, this.saltRounds);

      // Insert user
      const userResult = await client.query(`
        INSERT INTO users (
          id, email, password_hash, first_name, last_name, 
          company_name, phone, user_type, status, verification_level
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `, [
        uuidv4(),
        userData.email.toLowerCase(),
        passwordHash,
        userData.firstName || null,
        userData.lastName || null,
        userData.companyName || null,
        userData.phone || null,
        userData.userType,
        UserStatus.PENDING,
        0 // Initial verification level
      ]);

      const user = userResult.rows[0];

      // Assign default role based on user type
      const defaultRole = await this.getDefaultRoleForUserType(userData.userType);
      if (defaultRole) {
        await client.query(
          'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
          [user.id, defaultRole.id]
        );
      }

      await client.query('COMMIT');

      logger.info(`User registered successfully: ${user.email}`);

      // Return user with roles (excluding password)
      const userWithRoles = await this.getUserById(user.id);
      return userWithRoles!;

    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('User registration error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Login user
  async loginUser(loginData: UserLoginData): Promise<{ user: UserWithRoles; tokens: AuthTokens }> {
    try {
      // Get user by email
      const userResult = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [loginData.email.toLowerCase()]
      );

      if (userResult.rows.length === 0) {
        throw new Error('Invalid email or password');
      }

      const user = userResult.rows[0];

      // Check if user is suspended
      if (user.status === UserStatus.SUSPENDED) {
        throw new Error('Account is suspended');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(loginData.password, user.password_hash);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      // Update last login
      await db.query(
        'UPDATE users SET last_login = NOW() WHERE id = $1',
        [user.id]
      );

      // Get user with roles
      const userWithRoles = await this.getUserById(user.id);
      if (!userWithRoles) {
        throw new Error('User not found');
      }

      // Generate tokens
      const tokens = await this.generateTokens(userWithRoles);

      logger.info(`User logged in: ${user.email}`);

      return { user: userWithRoles, tokens };

    } catch (error) {
      logger.error('User login error:', error);
      throw error;
    }
  }

  // Get user by ID with roles and permissions
  async getUserById(userId: string): Promise<UserWithRoles | null> {
    try {
      const userResult = await db.query(`
        SELECT 
          u.id, u.email, u.first_name, u.last_name, u.company_name, u.phone,
          u.status, u.user_type, u.verification_level, u.created_at, u.updated_at, u.last_login
        FROM users u 
        WHERE u.id = $1
      `, [userId]);

      if (userResult.rows.length === 0) {
        return null;
      }

      const user = userResult.rows[0];

      // Get user roles
      const rolesResult = await db.query(`
        SELECT r.id, r.name, r.description
        FROM roles r
        JOIN user_roles ur ON r.id = ur.role_id
        WHERE ur.user_id = $1
      `, [userId]);

      // Get user permissions
      const permissionsResult = await db.query(`
        SELECT DISTINCT p.id, p.name, p.resource, p.action
        FROM permissions p
        JOIN role_permissions rp ON p.id = rp.permission_id
        JOIN user_roles ur ON rp.role_id = ur.role_id
        WHERE ur.user_id = $1
      `, [userId]);

      return {
        ...user,
        roles: rolesResult.rows,
        permissions: permissionsResult.rows
      };

    } catch (error) {
      logger.error('Get user by ID error:', error);
      throw error;
    }
  }

  // Check if user has permission
  async hasPermission(userId: string, resource: string, action: string): Promise<boolean> {
    try {
      const result = await db.query(`
        SELECT 1
        FROM permissions p
        JOIN role_permissions rp ON p.id = rp.permission_id
        JOIN user_roles ur ON rp.role_id = ur.role_id
        WHERE ur.user_id = $1 AND p.resource = $2 AND p.action = $3
        LIMIT 1
      `, [userId, resource, action]);

      return result.rows.length > 0;

    } catch (error) {
      logger.error('Permission check error:', error);
      return false;
    }
  }

  // Generate JWT tokens
  private async generateTokens(user: UserWithRoles): Promise<AuthTokens> {
    const jwtId = uuidv4();
    const now = Math.floor(Date.now() / 1000);
    const accessTokenExpiry = now + 3600; // 1 hour
    const refreshTokenExpiry = now + 604800; // 7 days

    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles.map(r => r.name),
      permissions: user.permissions.map(p => `${p.resource}:${p.action}`),
      verificationLevel: user.verificationLevel,
      iat: now,
      exp: accessTokenExpiry,
      jti: jwtId
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!);
    
    // Generate refresh token
    const refreshToken = jwt.sign(
      { 
        sub: user.id,
        type: 'refresh',
        jti: jwtId 
      },
      process.env.JWT_SECRET!,
      { expiresIn: this.refreshTokenExpiry }
    );

    // Store refresh token in Redis
    await redis.setEx(
      `refresh_token:${user.id}:${jwtId}`,
      604800, // 7 days
      refreshToken
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600
    };
  }

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as any;
      
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid refresh token');
      }

      // Check if refresh token exists in Redis
      const storedToken = await redis.get(`refresh_token:${decoded.sub}:${decoded.jti}`);
      if (!storedToken || storedToken !== refreshToken) {
        throw new Error('Refresh token not found or expired');
      }

      // Get user with roles
      const user = await this.getUserById(decoded.sub);
      if (!user) {
        throw new Error('User not found');
      }

      // Delete old refresh token
      await redis.del(`refresh_token:${decoded.sub}:${decoded.jti}`);

      // Generate new tokens
      return await this.generateTokens(user);

    } catch (error) {
      logger.error('Refresh token error:', error);
      throw error;
    }
  }

  // Logout user (blacklist token)
  async logoutUser(accessToken: string, refreshToken?: string): Promise<void> {
    try {
      // Decode access token to get expiry
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as JWTPayload;
      
      // Calculate remaining TTL
      const now = Math.floor(Date.now() / 1000);
      const ttl = decoded.exp - now;

      if (ttl > 0) {
        // Blacklist access token
        await redis.setEx(`blacklist:${accessToken}`, ttl, 'true');
      }

      // Remove refresh token if provided
      if (refreshToken) {
        try {
          const refreshDecoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as any;
          await redis.del(`refresh_token:${decoded.sub}:${refreshDecoded.jti}`);
        } catch (error) {
          // Ignore refresh token errors during logout
          logger.debug('Refresh token cleanup error during logout:', error);
        }
      }

      logger.info(`User logged out: ${decoded.email}`);

    } catch (error) {
      logger.error('Logout error:', error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(userId: string, updateData: Partial<UserRegistrationData>): Promise<UserWithRoles> {
    try {
      const setClause: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      // Build dynamic update query
      if (updateData.firstName !== undefined) {
        setClause.push(`first_name = $${paramIndex++}`);
        values.push(updateData.firstName);
      }
      if (updateData.lastName !== undefined) {
        setClause.push(`last_name = $${paramIndex++}`);
        values.push(updateData.lastName);
      }
      if (updateData.companyName !== undefined) {
        setClause.push(`company_name = $${paramIndex++}`);
        values.push(updateData.companyName);
      }
      if (updateData.phone !== undefined) {
        setClause.push(`phone = $${paramIndex++}`);
        values.push(updateData.phone);
      }

      if (setClause.length === 0) {
        throw new Error('No update data provided');
      }

      setClause.push(`updated_at = NOW()`);
      values.push(userId);

      await db.query(`
        UPDATE users 
        SET ${setClause.join(', ')}
        WHERE id = $${paramIndex}
      `, values);

      // Return updated user
      const updatedUser = await this.getUserById(userId);
      if (!updatedUser) {
        throw new Error('User not found after update');
      }

      logger.info(`User profile updated: ${updatedUser.email}`);
      return updatedUser;

    } catch (error) {
      logger.error('Update user profile error:', error);
      throw error;
    }
  }

  // Change user password
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      // Get current user
      const userResult = await db.query(
        'SELECT password_hash FROM users WHERE id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }

      const user = userResult.rows[0];

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, this.saltRounds);

      // Update password
      await db.query(
        'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
        [newPasswordHash, userId]
      );

      logger.info(`Password changed for user: ${userId}`);

    } catch (error) {
      logger.error('Change password error:', error);
      throw error;
    }
  }

  // Get default role for user type
  private async getDefaultRoleForUserType(userType: UserType) {
    try {
      const roleMap = {
        [UserType.BUYER]: 'buyer',
        [UserType.SELLER]: 'seller',
        [UserType.BROKER]: 'broker',
        [UserType.ADMIN]: 'admin'
      };

      const roleName = roleMap[userType];
      if (!roleName) return null;

      const result = await db.query(
        'SELECT id, name, description FROM roles WHERE name = $1',
        [roleName]
      );

      return result.rows.length > 0 ? result.rows[0] : null;

    } catch (error) {
      logger.error('Get default role error:', error);
      return null;
    }
  }
} 