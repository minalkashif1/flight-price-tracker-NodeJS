const mongoose = require('mongoose');

const PriceSnapshotSchema = new mongoose.Schema({
  flightId: { 
    type: String, 
    required: true, 
    index: true 
  },
  fetchedAt: { 
    type: Date, 
    default: Date.now,
    index: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0 
  },
  currency: { 
    type: String, 
    default: 'USD',
    uppercase: true 
  },
  source: { 
    type: String, 
    required: true 
  }
});

// Compound index for fast queries
PriceSnapshotSchema.index({ flightId: 1, fetchedAt: 1 });

module.exports = mongoose.model('PriceSnapshot', PriceSnapshotSchema);