const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3003;

// In-memory storage for demo
const aircraftListings = new Map();
const categories = new Map();
const manufacturers = new Map();

// Initialize sample data
function initializeSampleData() {
  // Sample categories
  categories.set('commercial', { id: 'commercial', name: 'Commercial Aircraft', description: 'Large commercial passenger aircraft' });
  categories.set('private', { id: 'private', name: 'Private Aircraft', description: 'Small private and business aircraft' });
  categories.set('cargo', { id: 'cargo', name: 'Cargo Aircraft', description: 'Freight and cargo aircraft' });
  categories.set('helicopter', { id: 'helicopter', name: 'Helicopters', description: 'Rotary-wing aircraft' });

  // Sample manufacturers
  manufacturers.set('boeing', { id: 'boeing', name: 'Boeing', country: 'USA' });
  manufacturers.set('airbus', { id: 'airbus', name: 'Airbus', country: 'France' });
  manufacturers.set('bombardier', { id: 'bombardier', name: 'Bombardier', country: 'Canada' });
  manufacturers.set('embraer', { id: 'embraer', name: 'Embraer', country: 'Brazil' });

  // Sample aircraft listings
  const sampleAircraft = {
    id: 'ac-001',
    title: 'Boeing 737-800 for Sale',
    description: 'Excellent condition Boeing 737-800, low hours, full maintenance history',
    category: 'commercial',
    manufacturer: 'boeing',
    model: '737-800',
    yearBuilt: 2015,
    serialNumber: 'SN123456',
    registrationNumber: 'N123AB',
    totalFlightHours: 15000,
    totalLandings: 8500,
    price: 25000000,
    currency: 'USD',
    location: 'Miami, FL, USA',
    sellerId: 'seller-001',
    sellerName: 'Aviation Sales Corp',
    status: 'active',
    verificationStatus: 'verified',
    verificationId: 'ver-1753853498937',
    images: [
      'https://example.com/aircraft1.jpg',
      'https://example.com/aircraft1-interior.jpg'
    ],
    specifications: {
      maxPassengers: 189,
      range: 3200,
      maxSpeed: 842,
      fuelCapacity: 26020,
      engines: 2,
      engineType: 'CFM56-7B26'
    },
    maintenanceHistory: [
      {
        date: '2024-01-15',
        type: 'C-Check',
        description: 'Major maintenance inspection completed',
        hours: 14000
      }
    ],
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date().toISOString()
  };

  aircraftListings.set(sampleAircraft.id, sampleAircraft);
}

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

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'marketplace-service',
    version: '1.0.0',
    listings: aircraftListings.size
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'ATP Marketplace Service is working!',
      timestamp: new Date().toISOString(),
      listings: aircraftListings.size,
      categories: categories.size,
      manufacturers: manufacturers.size
    }
  });
});

// Get all aircraft listings with filters
app.get('/api/aircraft', (req, res) => {
  const { 
    category, 
    manufacturer, 
    minPrice, 
    maxPrice, 
    minYear, 
    maxYear,
    status = 'active',
    limit = 20,
    offset = 0
  } = req.query;

  let results = Array.from(aircraftListings.values());

  // Apply filters
  if (category) {
    results = results.filter(aircraft => aircraft.category === category);
  }
  if (manufacturer) {
    results = results.filter(aircraft => aircraft.manufacturer === manufacturer);
  }
  if (minPrice) {
    results = results.filter(aircraft => aircraft.price >= parseInt(minPrice));
  }
  if (maxPrice) {
    results = results.filter(aircraft => aircraft.price <= parseInt(maxPrice));
  }
  if (minYear) {
    results = results.filter(aircraft => aircraft.yearBuilt >= parseInt(minYear));
  }
  if (maxYear) {
    results = results.filter(aircraft => aircraft.yearBuilt <= parseInt(maxYear));
  }
  if (status) {
    results = results.filter(aircraft => aircraft.status === status);
  }

  // Apply pagination
  const total = results.length;
  const paginatedResults = results.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

  res.json({
    success: true,
    data: {
      aircraft: paginatedResults,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < total
      }
    }
  });
});

// Get aircraft by ID
app.get('/api/aircraft/:id', (req, res) => {
  const { id } = req.params;
  const aircraft = aircraftListings.get(id);

  if (!aircraft) {
    return res.status(404).json({
      success: false,
      error: 'Aircraft not found'
    });
  }

  res.json({
    success: true,
    data: aircraft
  });
});

// Create new aircraft listing
app.post('/api/aircraft', async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      manufacturer,
      model,
      yearBuilt,
      serialNumber,
      registrationNumber,
      totalFlightHours,
      totalLandings,
      price,
      currency = 'USD',
      location,
      sellerId,
      sellerName,
      specifications,
      images = []
    } = req.body;

    // Validation
    if (!title || !description || !category || !manufacturer || !model || !price) {
      return res.status(400).json({
        success: false,
        error: 'Title, description, category, manufacturer, model, and price are required'
      });
    }

    // Validate category and manufacturer
    if (!categories.has(category)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid category'
      });
    }

    if (!manufacturers.has(manufacturer)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid manufacturer'
      });
    }

    const aircraft = {
      id: `ac-${Date.now()}`,
      title,
      description,
      category,
      manufacturer,
      model,
      yearBuilt: parseInt(yearBuilt),
      serialNumber,
      registrationNumber,
      totalFlightHours: parseInt(totalFlightHours) || 0,
      totalLandings: parseInt(totalLandings) || 0,
      price: parseInt(price),
      currency,
      location,
      sellerId,
      sellerName,
      status: 'pending',
      verificationStatus: 'pending',
      images,
      specifications: specifications || {},
      maintenanceHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    aircraftListings.set(aircraft.id, aircraft);

    console.log(`✅ Aircraft listing created: ${aircraft.id} - ${aircraft.title}`);

    res.status(201).json({
      success: true,
      data: aircraft,
      message: 'Aircraft listing created successfully'
    });

  } catch (error) {
    console.error('Create aircraft error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create aircraft listing'
    });
  }
});

// Update aircraft listing
app.put('/api/aircraft/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const aircraft = aircraftListings.get(id);

    if (!aircraft) {
      return res.status(404).json({
        success: false,
        error: 'Aircraft not found'
      });
    }

    // Update fields
    const updatedAircraft = {
      ...aircraft,
      ...req.body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    aircraftListings.set(id, updatedAircraft);

    console.log(`✅ Aircraft listing updated: ${id}`);

    res.json({
      success: true,
      data: updatedAircraft,
      message: 'Aircraft listing updated successfully'
    });

  } catch (error) {
    console.error('Update aircraft error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update aircraft listing'
    });
  }
});

// Delete aircraft listing
app.delete('/api/aircraft/:id', (req, res) => {
  const { id } = req.params;
  const aircraft = aircraftListings.get(id);

  if (!aircraft) {
    return res.status(404).json({
      success: false,
      error: 'Aircraft not found'
    });
  }

  aircraftListings.delete(id);

  console.log(`✅ Aircraft listing deleted: ${id}`);

  res.json({
    success: true,
    message: 'Aircraft listing deleted successfully'
  });
});

// Get categories
app.get('/api/categories', (req, res) => {
  const categoriesList = Array.from(categories.values());
  
  res.json({
    success: true,
    data: categoriesList
  });
});

// Get manufacturers
app.get('/api/manufacturers', (req, res) => {
  const manufacturersList = Array.from(manufacturers.values());
  
  res.json({
    success: true,
    data: manufacturersList
  });
});

// Search aircraft
app.get('/api/search', (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      error: 'Search query is required'
    });
  }

  const results = Array.from(aircraftListings.values()).filter(aircraft => {
    const searchTerm = q.toLowerCase();
    return (
      aircraft.title.toLowerCase().includes(searchTerm) ||
      aircraft.description.toLowerCase().includes(searchTerm) ||
      aircraft.model.toLowerCase().includes(searchTerm) ||
      aircraft.manufacturer.toLowerCase().includes(searchTerm) ||
      aircraft.registrationNumber?.toLowerCase().includes(searchTerm)
    );
  });

  res.json({
    success: true,
    data: {
      results,
      total: results.length,
      query: q
    }
  });
});

// Get marketplace statistics
app.get('/api/stats', (req, res) => {
  const listings = Array.from(aircraftListings.values());
  
  const stats = {
    totalListings: listings.length,
    activeListings: listings.filter(l => l.status === 'active').length,
    pendingListings: listings.filter(l => l.status === 'pending').length,
    verifiedListings: listings.filter(l => l.verificationStatus === 'verified').length,
    totalValue: listings.reduce((sum, l) => sum + l.price, 0),
    averagePrice: listings.length > 0 ? Math.round(listings.reduce((sum, l) => sum + l.price, 0) / listings.length) : 0,
    byCategory: {},
    byManufacturer: {}
  };

  // Calculate by category
  listings.forEach(listing => {
    stats.byCategory[listing.category] = (stats.byCategory[listing.category] || 0) + 1;
    stats.byManufacturer[listing.manufacturer] = (stats.byManufacturer[listing.manufacturer] || 0) + 1;
  });

  res.json({
    success: true,
    data: stats
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Initialize sample data and start server
initializeSampleData();

app.listen(PORT, () => {
  console.log(`🚀 ATP Marketplace Service running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`✈️  Aircraft listings: http://localhost:${PORT}/api/aircraft`);
  console.log(`📈 Statistics: http://localhost:${PORT}/api/stats`);
  console.log(`📋 Sample data loaded: ${aircraftListings.size} aircraft`);
});
