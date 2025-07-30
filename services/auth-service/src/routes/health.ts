import { Router, Request, Response } from 'express';
import { db, redis } from '../index';
import logger from '../utils/logger';

const router = Router();

/**
 * @route GET /health
 * @desc Basic health check
 * @access Public
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const health = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'auth-service',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };

    res.status(200).json(health);
  } catch (error) {
    logger.error('Health check error:', error);
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      service: 'auth-service',
      error: 'Health check failed'
    });
  }
});

/**
 * @route GET /health/detailed
 * @desc Detailed health check with dependencies
 * @access Public
 */
router.get('/detailed', async (_req: Request, res: Response) => {
  const startTime = Date.now();
  const health: any = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'auth-service',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks: {},
    responseTime: 0
  };

  let allHealthy = true;

  // Check database
  try {
    const dbStart = Date.now();
    await db.query('SELECT 1');
    health.checks.database = {
      status: 'OK',
      responseTime: Date.now() - dbStart,
      message: 'Database connection successful'
    };
  } catch (error: any) {
    allHealthy = false;
    health.checks.database = {
      status: 'ERROR',
      message: 'Database connection failed',
      error: error.message
    };
  }

  // Check Redis
  try {
    const redisStart = Date.now();
    await redis.ping();
    health.checks.redis = {
      status: 'OK',
      responseTime: Date.now() - redisStart,
      message: 'Redis connection successful'
    };
  } catch (error: any) {
    allHealthy = false;
    health.checks.redis = {
      status: 'ERROR',
      message: 'Redis connection failed',
      error: error.message
    };
  }

  // Check memory usage
  const memUsage = process.memoryUsage();
  const memUsageMB = {
    rss: Math.round(memUsage.rss / 1024 / 1024),
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
    external: Math.round(memUsage.external / 1024 / 1024)
  };

  health.checks.memory = {
    status: memUsageMB.heapUsed < 512 ? 'OK' : 'WARNING',
    usage: memUsageMB,
    message: memUsageMB.heapUsed < 512 ? 'Memory usage normal' : 'High memory usage detected'
  };

  // Check uptime
  const uptimeSeconds = process.uptime();
  health.checks.uptime = {
    status: 'OK',
    seconds: Math.round(uptimeSeconds),
    message: `Service running for ${Math.round(uptimeSeconds)} seconds`
  };

  health.responseTime = Date.now() - startTime;
  health.status = allHealthy ? 'OK' : 'DEGRADED';

  const statusCode = allHealthy ? 200 : 503;
  res.status(statusCode).json(health);
});

/**
 * @route GET /health/ready
 * @desc Readiness probe (Kubernetes)
 * @access Public
 */
router.get('/ready', async (_req: Request, res: Response) => {
  try {
    // Check if service is ready to accept traffic
    await db.query('SELECT 1');
    await redis.ping();
    
    res.status(200).json({
      status: 'READY',
      timestamp: new Date().toISOString(),
      service: 'auth-service'
    });
  } catch (error) {
    logger.error('Readiness check failed:', error);
    res.status(503).json({
      status: 'NOT_READY',
      timestamp: new Date().toISOString(),
      service: 'auth-service',
      error: 'Service dependencies not available'
    });
  }
});

/**
 * @route GET /health/live
 * @desc Liveness probe (Kubernetes)
 * @access Public
 */
router.get('/live', async (req: Request, res: Response) => {
  try {
    // Simple liveness check - just verify the process is running
    res.status(200).json({
      status: 'ALIVE',
      timestamp: new Date().toISOString(),
      service: 'auth-service',
      pid: process.pid
    });
  } catch (error) {
    logger.error('Liveness check failed:', error);
    res.status(500).json({
      status: 'DEAD',
      timestamp: new Date().toISOString(),
      service: 'auth-service',
      error: 'Liveness check failed'
    });
  }
});

export const healthRoutes = router; 