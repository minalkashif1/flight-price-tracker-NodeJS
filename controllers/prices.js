const PriceSnapshot = require('../models/pricesnapshots');

const getFlightPrices = async (req, res) => {
  try {
    const snapshots = await PriceSnapshot.find({ flightId: req.params.flightId })
      .sort({ fetchedAt: 1 });
    
    if (!snapshots.length) {
      return res.status(404).json({ 
        error: 'No price data found for this flight' 
      });
    }
    
    res.json({ 
      flightId: req.params.flightId, 
      prices: snapshots 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getFlightPrices };