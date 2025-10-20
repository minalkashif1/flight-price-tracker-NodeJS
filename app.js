const express = require('express');
const mongoose = require('mongoose');

const flightRoutes = require('./routes/flights_routes');
const priceRoutes = require('./routes/prices_routes');
const searchRoutes = require('./routes/search_routes');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/flighttrack', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected!'))
.catch(err => console.error('MongoDB Error:', err));

// Mount routers
app.use('/flights', flightRoutes);           // CRUD flights
app.use('/prices', priceRoutes);             // GET /prices/:flightId
app.use('/search', searchRoutes);            // POST /search

// Health check
app.get('/health', (req, res) => res.json({ ok: true, message: 'Server is running' }));

module.exports = app;
