// server.js - OnayPonay.net
const isProduction = process.env.NODE_ENV === 'production';
const express = require('express');
const cors = require('cors');
const path = require('path');

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

// Mock auction data
const mockAuctions = [
  {
    id: '1',
    title: 'Test Auction Item',
    description: 'This is a test auction item',
    startingBid: 50,
    currentBid: 75,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
  }
];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'OnayPonay backend is running',
    timestamp: new Date().toISOString()
  });
});

// Get all auctions
app.get('/api/auctions', (req, res) => {
  res.json(mockAuctions);
});

// Get specific auction
app.get('/api/auctions/:id', (req, res) => {
  const auction = mockAuctions.find(a => a.id === req.params.id);
  if (!auction) return res.status(404).json({ error: 'Auction not found' });
  res.json(auction);
});

// Create new auction
app.post('/api/auctions', (req, res) => {
  const newAuction = {
    id: Math.random().toString(36).substr(2, 9),
    title: req.body.title || 'Untitled Auction',
    description: req.body.description || '',
    startingBid: req.body.startingBid || 0,
    currentBid: req.body.startingBid || 0,
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
  };
  mockAuctions.push(newAuction);
  res.json({ 
    message: 'Auction created successfully',
    auctionId: newAuction.id
  });
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