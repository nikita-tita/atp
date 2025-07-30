export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  phone?: string;
  status: UserStatus;
  userType: UserType;
  verificationLevel: number;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export enum UserStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  SUSPENDED = 'suspended'
}

export enum UserType {
  BUYER = 'buyer',
  SELLER = 'seller',
  BROKER = 'broker',
  ADMIN = 'admin'
}

export interface UserRegistrationData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  phone?: string;
  userType: UserType;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface JWTPayload {
  sub: string; // user ID
  email: string;
  roles: string[];
  permissions: string[];
  verificationLevel: number;
  iat: number;
  exp: number;
  jti: string; // JWT ID for revocation
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
}

export interface Permission {
  id: number;
  name: string;
  resource: string;
  action: string;
}

export interface UserWithRoles extends Omit<User, 'passwordHash'> {
  roles: Role[];
  permissions: Permission[];
}

export interface PasswordResetRequest {
  email: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

export interface RefreshTokenData {
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
  lastUsed?: Date;
} 