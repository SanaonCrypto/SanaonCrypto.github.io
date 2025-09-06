const isProduction = process.env.NODE_ENV === 'production';
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: isProduction 
        ? 'https://sanaoncrypto.github.io'  // Your GitHub Pages
        : ['http://localhost:3000', 'http://localhost:8080'] // Local development
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// Basic routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'OnayPonay backend is running' });
});

// Your auction endpoints would go here
app.post('/api/auctions', (req, res) => {
  // Create auction logic
});

app.post('/api/bidders', (req, res) => {
  // Add bidder logic
});

app.post('/api/auctions/:id/run', (req, res) => {
  // Run auction logic
});

// Serve your frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
