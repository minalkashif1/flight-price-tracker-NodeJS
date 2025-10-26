const express = require('express');

const flightRoutes = require('./routes/flights_routes');
const priceRoutes = require('./routes/prices_routes');
const searchRoutes = require('./routes/search_routes');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Mount routers
app.use('/flights', flightRoutes);
app.use('/prices', priceRoutes);
app.use('/search', searchRoutes);

// Health check
app.get('/health', (req, res) => res.json({ ok: true, message: 'Server is running' }));

module.exports = app;