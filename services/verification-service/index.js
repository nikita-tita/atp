const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3002;

// In-memory storage for demo
const verificationResults = new Map();

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
function simulateFAAVerification(aircraft) {
  // Simulate FAA verification based on registration number format
  if (aircraft.registrationNumber && aircraft.registrationNumber.startsWith('N')) {
    return 'VALID';
  }
  return 'PENDING';
}

function calculateComplianceScore(aircraft) {
  let score = 60; // Base score
  
  if (aircraft.registrationNumber) score += 10;
  if (aircraft.serialNumber) score += 10;
  if (aircraft.yearBuilt && aircraft.yearBuilt > 1980) score += 10;
  if (aircraft.manufacturer) score += 10;
  
  return Math.min(score, 100);
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'verification-service',
    version: '1.0.0'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'ATP Verification Service is working!',
      timestamp: new Date().toISOString(),
      verifications: verificationResults.size
    }
  });
});

// Verify aircraft
app.post('/api/verify', async (req, res) => {
  try {
    const { aircraftId, serialNumber, model, manufacturer, yearBuilt, registrationNumber } = req.body;

    // Validation
    if (!aircraftId || !serialNumber) {
      return res.status(400).json({
        success: false,
        error: 'AircraftID and SerialNumber are required'
      });
    }

    // Simulate FAA verification
    const faaStatus = simulateFAAVerification(req.body);
    
    // Create verification result
    const result = {
      id: `ver-${Date.now()}`,
      aircraftId,
      status: 'verified',
      faaStatus,
      faaRegistrationData: {
        registration: registrationNumber,
        manufacturer,
        model,
        year: yearBuilt,
        serialNumber
      },
      documentsVerified: true,
      complianceScore: calculateComplianceScore(req.body),
      lastVerified: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // Valid for 1 year
      notes: 'Verification completed successfully'
    };

    // Store result
    verificationResults.set(result.id, result);

    console.log(`✅ Aircraft verified: ${aircraftId} (Score: ${result.complianceScore})`);

    res.json({
      success: true,
      data: result,
      message: 'Aircraft verification completed'
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Verification failed'
    });
  }
});

// Get verification by ID
app.get('/api/verifications/:id', (req, res) => {
  const { id } = req.params;
  const result = verificationResults.get(id);

  if (!result) {
    return res.status(404).json({
      success: false,
      error: 'Verification not found'
    });
  }

  res.json({
    success: true,
    data: result
  });
});

// List all verifications
app.get('/api/verifications', (req, res) => {
  const results = Array.from(verificationResults.values());

  res.json({
    success: true,
    data: {
      verifications: results,
      total: results.length
    }
  });
});

// Aircraft registration lookup (simulated)
app.get('/api/faa/lookup/:registration', async (req, res) => {
  const { registration } = req.params;

  // Simulate FAA registry lookup
  if (registration.startsWith('N')) {
    res.json({
      success: true,
      data: {
        registration,
        status: 'ACTIVE',
        manufacturer: 'Boeing',
        model: '737-800',
        year: 2010,
        owner: 'Sample Aviation LLC',
        lastUpdate: new Date().toISOString()
      }
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'Registration not found in FAA database'
    });
  }
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ATP Verification Service (Node.js) running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`✈️  Verification endpoint: http://localhost:${PORT}/api/verify`);
  console.log(`🔍 FAA lookup: http://localhost:${PORT}/api/faa/lookup/{registration}`);
}); 