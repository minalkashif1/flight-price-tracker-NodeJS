const mongoose = require('mongoose');

const FlightSchema = new mongoose.Schema({
  flightId: { 
    type: String, 
    unique: true, 
    required: true, 
    trim: true 
  },
  route: { 
    from: { 
      type: String, 
      required: true, 
      uppercase: true 
    },
    to: { 
      type: String, 
      required: true, 
      uppercase: true 
    }
  },
  airline: { 
    type: String, 
    required: true,
    uppercase: true 
  },
  flightDate: { 
    type: Date, 
    required: true 
  },
  tracking: {
    enabled: { 
      type: Boolean, 
      default: true 
    },
    startThresholdDaysBefore: { 
      type: Number, 
      default: 7, 
      min: 1, 
      max: 30 
    },
    interval: { 
      type: String, 
      enum: ['1h', '2h', '4h', '6h', '12h', '24h'],
      default: '2h' 
    },
    lastFetchedAt: Date
  },
  metadata: { 
    type: mongoose.Schema.Types.Mixed, 
    default: {} 
  }
}, {
  timestamps: true
});

// Indexes
FlightSchema.index({ airline: 'text', 'route.from': 'text', 'route.to': 'text' });
FlightSchema.index({ flightDate: -1 });
FlightSchema.index({ airline: 1, 'route.from': 1 });

// Create and export the model
const Flight = mongoose.model('Flight', FlightSchema);
module.exports = Flight;