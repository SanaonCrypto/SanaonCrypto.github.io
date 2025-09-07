const isProduction = process.env.NODE_ENV === 'production';
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - CORS configuration
app.use(cors({
    origin: isProduction 
        ? 'https://sanaoncrypto.github.io'  // Your GitHub Pages
        : ['http://localhost:3000', 'http://localhost:8080'] // Local development
}));

app.use(express.json());

// Only serve static files in development
if (!isProduction) {
    app.use(express.static(path.join(__dirname, '.')));
}

// Basic routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'OnayPonay backend is running',
    environment: isProduction ? 'production' : 'development'
  });
});

// Your auction endpoints
app.post('/api/auctions', (req, res) => {
  // Create auction logic
  res.json({ message: 'Auction created successfully' });
});

app.post('/api/bidders', (req, res) => {
  // Add bidder logic
  res.json({ message: 'Bidder added successfully' });
});

app.post('/api/auctions/:id/run', (req, res) => {
  const auctionId = req.params.id;
  // Run auction logic using auctionId
  res.json({ message: `Auction ${auctionId} run completed` });
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
