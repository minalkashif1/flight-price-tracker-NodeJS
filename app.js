const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/flighttrack', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected!'))
  .catch(err => console.error('MongoDB Error:', err));

// Simple Flight model
const Flight = mongoose.model('Flight', new mongoose.Schema({
  flightId: String,
  route: { from: String, to: String },
  airline: String,
  flightDate: Date
}));

// Routes
app.get('/health', (req, res) => res.json({ ok: true }));
app.get('/flights', async (req, res) => res.json(await Flight.find({})));
app.post('/flights', async (req, res) => {
  try {
    const f = new Flight(req.body);
    await f.save();
    res.json(f);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// EXPORT app (server.js will start it)
module.exports = app;