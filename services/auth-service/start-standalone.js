const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory storage
const users = new Map();
const blacklistedTokens = new Set();
const refreshTokens = new Map();

const JWT_SECRET = 'development-secret-key-atp-platform-2024-very-long-and-secure';

// Add default admin user
const adminId = uuidv4();
const adminPasswordHash = bcrypt.hashSync('Admin123!', 12);
users.set(adminId, {
  id: adminId,
  email: 'admin@atpplatform.com',
  passwordHash: adminPasswordHash,
  firstName: 'ATP',
  lastName: 'Administrator',
  companyName: 'ATP Platform',
  status: 'verified',
  userType: 'admin',
  verificationLevel: 3,
  roles: ['admin'],
  createdAt: new Date(),
  updatedAt: new Date()
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3100'],
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP'
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Helper functions
const generateTokens = (user) => {
  const payload = {
    sub: user.id,
    email: user.email,
    roles: user.roles,
    verificationLevel: user.verificationLevel,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour
  };

  const accessToken = jwt.sign(payload, JWT_SECRET);
  const refreshToken = jwt.sign({ sub: user.id, type: 'refresh' }, JWT_SECRET, { expiresIn: '7d' });

  // Store refresh token
  refreshTokens.set(refreshToken, {
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: 3600
  };
};

// Auth middleware
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    const token = authHeader.substring(7);

    if (blacklistedTokens.has(token)) {
      return res.status(401).json({
        success: false,
        error: 'Token has been revoked'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.get(decoded.sub);
    
    if (!user || user.status === 'suspended') {
      return res.status(401).json({
        success: false,
        error: 'User account is not active'
      });
    }

    req.user = decoded;
    req.userId = decoded.sub;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Authentication error'
    });
  }
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'auth-service-standalone',
    version: '1.0.0',
    users: users.size
  });
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, companyName, phone, userType } = req.body;

    // Validation
    if (!email || !password || !userType) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and userType are required'
      });
    }

    // Check if user exists
    const existingUser = Array.from(users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Create user
    const userId = uuidv4();
    const passwordHash = await bcrypt.hash(password, 12);
    
    const newUser = {
      id: userId,
      email: email.toLowerCase(),
      passwordHash,
      firstName,
      lastName,
      companyName,
      phone,
      status: 'pending',
      userType,
      verificationLevel: 0,
      roles: [userType],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    users.set(userId, newUser);

    console.log(`✅ User registered: ${email}`);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          companyName: newUser.companyName,
          phone: newUser.phone,
          userType: newUser.userType,
          status: newUser.status,
          verificationLevel: newUser.verificationLevel,
          roles: newUser.roles,
          createdAt: newUser.createdAt
        }
      },
      message: 'User registered successfully'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = Array.from(users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check if suspended
    if (user.status === 'suspended') {
      return res.status(401).json({
        success: false,
        error: 'Account is suspended'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    users.set(user.id, user);

    // Generate tokens
    const tokens = generateTokens(user);

    console.log(`✅ User logged in: ${email}`);

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
          lastLogin: user.lastLogin
        },
        tokens
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// Get profile
app.get('/api/auth/profile', verifyToken, (req, res) => {
  try {
    const user = users.get(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
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
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastLogin: user.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user profile'
    });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'ATP Platform Auth Service is working!',
      timestamp: new Date().toISOString(),
      users: users.size,
      blacklistedTokens: blacklistedTokens.size,
      refreshTokens: refreshTokens.size
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ATP Auth Service (Standalone) running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`👤 Default admin: admin@atpplatform.com / Admin123!`);
  console.log(`📋 Users in memory: ${users.size}`);
}); 