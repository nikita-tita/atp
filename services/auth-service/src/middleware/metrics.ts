import { Request, Response, NextFunction } from 'express';
import { register, Counter, Histogram, Gauge } from 'prom-client';

// Create metrics
const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]
});

const activeConnections = new Gauge({
  name: 'http_active_connections',
  help: 'Number of active HTTP connections'
});

const memoryUsage = new Gauge({
  name: 'process_memory_usage_bytes',
  help: 'Process memory usage in bytes',
  labelNames: ['type']
});

const authOperationsTotal = new Counter({
  name: 'auth_operations_total',
  help: 'Total number of authentication operations',
  labelNames: ['operation', 'result']
});

const activeUsers = new Gauge({
  name: 'auth_active_users',
  help: 'Number of currently authenticated users'
});

// Update memory metrics periodically
setInterval(() => {
  const memUsage = process.memoryUsage();
  memoryUsage.set({ type: 'rss' }, memUsage.rss);
  memoryUsage.set({ type: 'heapTotal' }, memUsage.heapTotal);
  memoryUsage.set({ type: 'heapUsed' }, memUsage.heapUsed);
  memoryUsage.set({ type: 'external' }, memUsage.external);
}, 10000); // Update every 10 seconds

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  
  // Increment active connections
  activeConnections.inc();

  // Override res.end to collect metrics
  const originalEnd = res.end;
  res.end = function(this: Response, ...args: any[]): Response {
    const duration = (Date.now() - startTime) / 1000;
    const route = req.route?.path || req.path || 'unknown';
    
    // Record metrics
    httpRequestsTotal.inc({
      method: req.method,
      route: route,
      status_code: res.statusCode.toString()
    });

    httpRequestDuration.observe(
      {
        method: req.method,
        route: route,
        status_code: res.statusCode.toString()
      },
      duration
    );

    // Decrement active connections
    activeConnections.dec();

    // Track authentication operations
    if (req.path.startsWith('/api/auth/')) {
      let operation = 'unknown';
      let result = res.statusCode < 400 ? 'success' : 'error';

      if (req.path.includes('/login')) {
        operation = 'login';
      } else if (req.path.includes('/register')) {
        operation = 'register';
      } else if (req.path.includes('/refresh')) {
        operation = 'refresh';
      } else if (req.path.includes('/logout')) {
        operation = 'logout';
      } else if (req.path.includes('/verify')) {
        operation = 'verify';
      }

      authOperationsTotal.inc({ operation, result });
    }

    return originalEnd.apply(this, args);
  };

  next();
};

// Export metrics for manual tracking
export const metrics = {
  authOperationsTotal,
  activeUsers,
  httpRequestsTotal,
  httpRequestDuration,
  activeConnections,
  memoryUsage
};

// Helper functions for tracking business metrics
export const trackUserLogin = () => {
  authOperationsTotal.inc({ operation: 'login', result: 'success' });
};

export const trackUserLogout = () => {
  authOperationsTotal.inc({ operation: 'logout', result: 'success' });
};

export const updateActiveUsers = (count: number) => {
  activeUsers.set(count);
}; 