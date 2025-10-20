const Flight = require('../models/flights');

// CREATE flight
const createFlight = async (req, res) => {
  try {
    const flight = new Flight(req.body);
    await flight.save();
    res.status(201).json(flight);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET all flights (with filters)
const getFlights = async (req, res) => {
  try {
    const query = {};
    
    // Dynamic filtering
    if (req.query.from) query['route.from'] = req.query.from.toUpperCase();
    if (req.query.to) query['route.to'] = req.query.to.toUpperCase();
    if (req.query.airline) query.airline = req.query.airline.toUpperCase();
    
    const flights = await Flight.find(query)
      .sort({ flightDate: 1 })
      .limit(100);
    
    res.json(flights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single flight
const getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findOne({ flightId: req.params.flightId });
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    res.json(flight);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE flight
const updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findOneAndUpdate(
      { flightId: req.params.flightId }, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    
    res.json(flight);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createFlight,
  getFlights,
  getFlightById,
  updateFlight
};