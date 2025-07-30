const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3006;

// In-memory storage for demo
const transactions = new Map();
const paymentMethods = new Map();
const subscriptions = new Map();

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

// Auth middleware (simplified)
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }
  req.userId = 'user-' + Date.now();
  next();
};

// Helper functions
function generateTransactionId() {
  return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function simulateStripePayment(paymentData) {
  // Simulate Stripe payment processing
  const success = Math.random() > 0.1; // 90% success rate
  
  if (success) {
    return {
      status: 'succeeded',
      chargeId: 'ch_' + Math.random().toString(36).substr(2, 16),
      receiptUrl: 'https://pay.stripe.com/receipts/test_receipt'
    };
  } else {
    return {
      status: 'failed',
      error: 'Your card was declined'
    };
  }
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'payment-service',
    version: '1.0.0',
    transactions: transactions.size
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'ATP Payment Service is working!',
      timestamp: new Date().toISOString(),
      transactions: transactions.size,
      subscriptions: subscriptions.size
    }
  });
});

// Process payment
app.post('/api/payments/process', requireAuth, async (req, res) => {
  try {
    const {
      amount,
      currency = 'USD',
      description,
      paymentMethodId,
      customerEmail,
      metadata = {}
    } = req.body;

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid amount is required'
      });
    }

    if (!paymentMethodId) {
      return res.status(400).json({
        success: false,
        error: 'Payment method is required'
      });
    }

    // Simulate Stripe payment
    const paymentResult = simulateStripePayment({
      amount,
      currency,
      paymentMethodId
    });

    const transactionId = generateTransactionId();
    const transaction = {
      id: transactionId,
      userId: req.userId,
      amount: parseFloat(amount),
      currency,
      description,
      status: paymentResult.status,
      chargeId: paymentResult.chargeId,
      receiptUrl: paymentResult.receiptUrl,
      error: paymentResult.error,
      customerEmail,
      metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    transactions.set(transactionId, transaction);

    if (paymentResult.status === 'succeeded') {
      console.log(`✅ Payment processed: $${amount} ${currency} (ID: ${transactionId})`);
      
      res.json({
        success: true,
        data: transaction,
        message: 'Payment processed successfully'
      });
    } else {
      console.log(`❌ Payment failed: ${paymentResult.error} (ID: ${transactionId})`);
      
      res.status(402).json({
        success: false,
        data: transaction,
        error: paymentResult.error
      });
    }

  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Payment processing failed'
    });
  }
});

// Get transaction by ID
app.get('/api/transactions/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const transaction = transactions.get(id);

  if (!transaction) {
    return res.status(404).json({
      success: false,
      error: 'Transaction not found'
    });
  }

  res.json({
    success: true,
    data: transaction
  });
});

// Get user transactions
app.get('/api/transactions', requireAuth, (req, res) => {
  const userTransactions = Array.from(transactions.values())
    .filter(txn => txn.userId === req.userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({
    success: true,
    data: {
      transactions: userTransactions,
      total: userTransactions.length
    }
  });
});

// Refund transaction
app.post('/api/transactions/:id/refund', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, reason } = req.body;
    
    const transaction = transactions.get(id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    if (transaction.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        error: 'Can only refund successful transactions'
      });
    }

    // Simulate refund
    const refundAmount = amount || transaction.amount;
    const refundId = 'rf_' + Math.random().toString(36).substr(2, 16);
    
    const refund = {
      id: refundId,
      transactionId: id,
      amount: refundAmount,
      currency: transaction.currency,
      reason: reason || 'requested_by_customer',
      status: 'succeeded',
      createdAt: new Date().toISOString()
    };

    // Update transaction
    transaction.refunds = transaction.refunds || [];
    transaction.refunds.push(refund);
    transaction.updatedAt = new Date().toISOString();
    
    transactions.set(id, transaction);

    console.log(`💰 Refund processed: $${refundAmount} ${transaction.currency} (Transaction: ${id})`);

    res.json({
      success: true,
      data: refund,
      message: 'Refund processed successfully'
    });

  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      success: false,
      error: 'Refund processing failed'
    });
  }
});

// Subscription plans
app.get('/api/plans', (req, res) => {
  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      description: 'Basic access to verified marketplace',
      price: 500,
      currency: 'USD',
      interval: 'monthly',
      features: ['5 listings', 'Basic verification', 'Email support']
    },
    {
      id: 'professional',
      name: 'Professional Plan', 
      description: 'Enhanced features with analytics',
      price: 1500,
      currency: 'USD',
      interval: 'monthly',
      features: ['25 listings', 'Professional verification', 'Analytics', 'Priority support']
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      description: 'Full platform access with custom features',
      price: 3000,
      currency: 'USD',
      interval: 'monthly',
      features: ['Unlimited listings', 'Premium verification', 'Analytics', 'API access', 'Dedicated support']
    }
  ];

  res.json({
    success: true,
    data: {
      plans,
      total: plans.length
    }
  });
});

// Add sample transactions on startup
function addSampleTransactions() {
  const sampleTransactions = [
    {
      amount: 500,
      currency: 'USD',
      description: 'Basic Plan - Monthly Subscription',
      status: 'succeeded',
      customerEmail: 'test@example.com'
    },
    {
      amount: 25000,
      currency: 'USD', 
      description: 'Aircraft Listing Fee - Boeing 737',
      status: 'succeeded',
      customerEmail: 'airline@example.com'
    }
  ];

  sampleTransactions.forEach(txn => {
    const id = generateTransactionId();
    const fullTransaction = {
      ...txn,
      id,
      userId: 'demo-user-' + Math.random().toString(36).substr(2, 9),
      chargeId: 'ch_' + Math.random().toString(36).substr(2, 16),
      receiptUrl: 'https://pay.stripe.com/receipts/demo_receipt',
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    transactions.set(id, fullTransaction);
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ATP Payment Service running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`💳 Payment endpoint: http://localhost:${PORT}/api/payments/process`);
  console.log(`📋 Plans endpoint: http://localhost:${PORT}/api/plans`);
  
  // Add sample data
  addSampleTransactions();
  console.log(`💰 Sample transactions added: ${transactions.size}`);
});
