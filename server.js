// server.js - OnayPonay.net with PostgreSQL Integration
//require('dotenv').config(); // Load environment variables for local development

const isProduction = process.env.NODE_ENV === 'production';
const express = require('express');
const cors = require('cors');
const path = require('path');

// ✅ ADDED: PostgreSQL client
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - CORS configuration
app.use(cors({
    origin: isProduction 
        ? 'https://sanaoncrypto.github.io'
        : ['http://localhost:3000', 'http://localhost:8080']
}));

app.use(express.json());

// Only serve static files in development
if (!isProduction) {
    app.use(express.static(path.join(__dirname, '.')));
}

// ✅ ADDED: Create database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

// ✅ ADDED: Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection error:', err.stack);
  } else {
    console.log('✅ Database connected successfully!');
    release();
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  // ✅ ADDED: Simple database check in health endpoint
  pool.query('SELECT NOW()', (err, result) => {
    if (err) {
      res.json({ 
        status: 'WARNING', 
        message: 'OnayPonay backend is running but database connection failed',
        timestamp: new Date().toISOString(),
        error: err.message
      });
    } else {
      res.json({ 
        status: 'OK', 
        message: 'OnayPonay backend is running with database connection',
        timestamp: new Date().toISOString(),
        database: 'Connected'
      });
    }
  });
});

// Get all auctions - NOW FROM DATABASE
app.get('/api/auctions', async (req, res) => {
  try {
    // Query to get all auctions from the database
    const result = await pool.query('SELECT * FROM auctions ORDER BY created_at DESC');
    res.json(result.rows); // Send the data from the database
  } catch (err) {
    console.error('Error fetching auctions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific auction - NOW FROM DATABASE
app.get('/api/auctions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM auctions WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Auction not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching auction:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new auction - NOW SAVING TO DATABASE
app.post('/api/auctions', async (req, res) => {
  const { title, description, starting_bid } = req.body;

  // Basic validation
  if (!title || !starting_bid) {
    return res.status(400).json({ error: 'Title and starting bid are required' });
  }

  try {
    // SQL query to insert a new auction. 'RETURNING *' returns the created record.
    const result = await pool.query(
      `INSERT INTO auctions (title, description, starting_bid, current_bid, end_time)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, description, starting_bid, starting_bid, new Date(Date.now() + 24 * 60 * 60 * 1000)] // Sets end_time to 24h from now
    );

    res.status(201).json({
      message: 'Auction created successfully',
      auction: result.rows[0] // Send back the full auction object from the DB
    });
  } catch (err) {
    console.error('Error creating auction:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Only serve index.html in development
if (!isProduction) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
}

// Production: Only API routes are available
if (isProduction) {
  app.get('*', (req, res) => {
    res.status(404).json({ 
      error: 'Not found',
      message: 'This is an API-only server. Frontend is hosted separately.'
    });
  });
}

app.listen(PORT, () => {
  console.log(`
  🚀 OnayPonay Server running on port ${PORT}
  📊 Environment: ${isProduction ? 'production' : 'development'}
  🌐 API Health: http://localhost:${PORT}/api/health
  ${!isProduction ? `📍 Frontend: http://localhost:${PORT}` : ''}
  `);
});