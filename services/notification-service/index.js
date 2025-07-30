const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3005;

// In-memory storage for demo
const notifications = new Map();
const templates = new Map();
const preferences = new Map();

// Initialize notification templates
templates.set('welcome', {
  id: 'welcome',
  name: 'Welcome Email',
  subject: 'Welcome to ATP Platform!',
  body: 'Welcome {{firstName}}! Your account has been created successfully.',
  type: 'email'
});

templates.set('verification_complete', {
  id: 'verification_complete',
  name: 'Verification Complete',
  subject: 'Aircraft Verification Complete',
  body: 'Your aircraft {{aircraftModel}} has been successfully verified.',
  type: 'email'
});

templates.set('payment_success', {
  id: 'payment_success',
  name: 'Payment Successful',
  subject: 'Payment Confirmation',
  body: 'Payment of ${{amount}} {{currency}} has been processed successfully.',
  type: 'email'
});

templates.set('listing_approved', {
  id: 'listing_approved',
  name: 'Listing Approved',
  subject: 'Your listing has been approved',
  body: 'Congratulations! Your listing "{{listingTitle}}" is now live.',
  type: 'email'
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3100'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Helper functions
function generateNotificationId() {
  return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function processTemplate(template, variables = {}) {
  let processedSubject = template.subject;
  let processedBody = template.body;
  
  Object.keys(variables).forEach(key => {
    const placeholder = `{{${key}}}`;
    processedSubject = processedSubject.replace(new RegExp(placeholder, 'g'), variables[key]);
    processedBody = processedBody.replace(new RegExp(placeholder, 'g'), variables[key]);
  });
  
  return {
    subject: processedSubject,
    body: processedBody
  };
}

function simulateEmailSend(emailData) {
  // Simulate email sending (would use SendGrid in production)
  const success = Math.random() > 0.05; // 95% success rate
  
  return {
    success,
    messageId: success ? 'msg_' + Math.random().toString(36).substr(2, 16) : null,
    error: success ? null : 'Failed to send email'
  };
}

function simulateSmsSend(smsData) {
  // Simulate SMS sending (would use Twilio in production)
  const success = Math.random() > 0.1; // 90% success rate
  
  return {
    success,
    messageId: success ? 'sms_' + Math.random().toString(36).substr(2, 16) : null,
    error: success ? null : 'Failed to send SMS'
  };
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'notification-service',
    version: '1.0.0',
    notifications: notifications.size
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'ATP Notification Service is working!',
      timestamp: new Date().toISOString(),
      notifications: notifications.size,
      templates: templates.size
    }
  });
});

// Get all templates
app.get('/api/templates', (req, res) => {
  const templateList = Array.from(templates.values());
  res.json({
    success: true,
    data: {
      templates: templateList,
      total: templateList.length
    }
  });
});

// Send notification
app.post('/api/notifications/send', async (req, res) => {
  try {
    const {
      type, // 'email' or 'sms'
      recipient,
      templateId,
      subject,
      body,
      variables = {},
      priority = 'normal'
    } = req.body;

    // Validation
    if (!type || !recipient) {
      return res.status(400).json({
        success: false,
        error: 'Type and recipient are required'
      });
    }

    if (!['email', 'sms'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Type must be email or sms'
      });
    }

    let finalSubject = subject;
    let finalBody = body;

    // Use template if provided
    if (templateId) {
      const template = templates.get(templateId);
      if (!template) {
        return res.status(404).json({
          success: false,
          error: 'Template not found'
        });
      }

      const processed = processTemplate(template, variables);
      finalSubject = finalSubject || processed.subject;
      finalBody = finalBody || processed.body;
    }

    if (!finalBody) {
      return res.status(400).json({
        success: false,
        error: 'Body or templateId is required'
      });
    }

    const notificationId = generateNotificationId();
    
    // Send notification
    let sendResult;
    if (type === 'email') {
      sendResult = simulateEmailSend({
        to: recipient,
        subject: finalSubject,
        body: finalBody
      });
    } else {
      sendResult = simulateSmsSend({
        to: recipient,
        body: finalBody
      });
    }

    const notification = {
      id: notificationId,
      type,
      recipient,
      subject: finalSubject,
      body: finalBody,
      templateId,
      variables,
      priority,
      status: sendResult.success ? 'sent' : 'failed',
      messageId: sendResult.messageId,
      error: sendResult.error,
      attempts: 1,
      createdAt: new Date().toISOString(),
      sentAt: sendResult.success ? new Date().toISOString() : null
    };

    notifications.set(notificationId, notification);

    if (sendResult.success) {
      console.log(`✅ ${type.toUpperCase()} sent to ${recipient}: ${finalSubject || finalBody.substring(0, 50)}...`);
      
      res.json({
        success: true,
        data: notification,
        message: 'Notification sent successfully'
      });
    } else {
      console.log(`❌ ${type.toUpperCase()} failed to ${recipient}: ${sendResult.error}`);
      
      res.status(500).json({
        success: false,
        data: notification,
        error: sendResult.error
      });
    }

  } catch (error) {
    console.error('Notification sending error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send notification'
    });
  }
});

// Get notification by ID
app.get('/api/notifications/:id', (req, res) => {
  const { id } = req.params;
  const notification = notifications.get(id);

  if (!notification) {
    return res.status(404).json({
      success: false,
      error: 'Notification not found'
    });
  }

  res.json({
    success: true,
    data: notification
  });
});

// Get all notifications
app.get('/api/notifications', (req, res) => {
  const { 
    type, 
    status, 
    recipient,
    page = 1, 
    limit = 20 
  } = req.query;

  let notificationList = Array.from(notifications.values());

  // Apply filters
  if (type) {
    notificationList = notificationList.filter(n => n.type === type);
  }
  if (status) {
    notificationList = notificationList.filter(n => n.status === status);
  }
  if (recipient) {
    notificationList = notificationList.filter(n => n.recipient.includes(recipient));
  }

  // Sort by creation date (newest first)
  notificationList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedNotifications = notificationList.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: {
      notifications: paginatedNotifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: notificationList.length,
        pages: Math.ceil(notificationList.length / limit)
      }
    }
  });
});

// Bulk send notifications
app.post('/api/notifications/bulk', async (req, res) => {
  try {
    const { notifications: notificationList } = req.body;

    if (!Array.isArray(notificationList) || notificationList.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Notifications array is required'
      });
    }

    const results = [];

    for (const notif of notificationList) {
      try {
        // Process each notification (simplified)
        const notificationId = generateNotificationId();
        
        const sendResult = notif.type === 'email' 
          ? simulateEmailSend(notif)
          : simulateSmsSend(notif);

        const notification = {
          id: notificationId,
          ...notif,
          status: sendResult.success ? 'sent' : 'failed',
          messageId: sendResult.messageId,
          error: sendResult.error,
          createdAt: new Date().toISOString(),
          sentAt: sendResult.success ? new Date().toISOString() : null
        };

        notifications.set(notificationId, notification);
        results.push(notification);

      } catch (error) {
        results.push({
          ...notif,
          status: 'failed',
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.status === 'sent').length;
    const failureCount = results.length - successCount;

    console.log(`📨 Bulk send completed: ${successCount} sent, ${failureCount} failed`);

    res.json({
      success: true,
      data: {
        results,
        summary: {
          total: results.length,
          sent: successCount,
          failed: failureCount
        }
      },
      message: `Bulk notification completed: ${successCount}/${results.length} sent`
    });

  } catch (error) {
    console.error('Bulk notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Bulk notification failed'
    });
  }
});

// Add sample notifications on startup
function addSampleNotifications() {
  const sampleNotifications = [
    {
      type: 'email',
      recipient: 'user@example.com',
      subject: 'Welcome to ATP Platform',
      body: 'Your account has been created successfully',
      status: 'sent'
    },
    {
      type: 'sms',
      recipient: '+1234567890',
      body: 'Your verification code is: 123456',
      status: 'sent'
    }
  ];

  sampleNotifications.forEach(notif => {
    const id = generateNotificationId();
    const fullNotification = {
      ...notif,
      id,
      messageId: notif.type === 'email' ? 'msg_demo' : 'sms_demo',
      attempts: 1,
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      sentAt: new Date().toISOString()
    };
    
    notifications.set(id, fullNotification);
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ATP Notification Service running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`📧 Send notification: http://localhost:${PORT}/api/notifications/send`);
  console.log(`📋 Templates: http://localhost:${PORT}/api/templates`);
  
  // Add sample data
  addSampleNotifications();
  console.log(`📨 Sample notifications added: ${notifications.size}`);
});
