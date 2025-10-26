// server.js
require('dotenv').config();
const mongoose = require('mongoose');
const cron = require('node-cron'); // Add this
const app = require('./app');
const PriceTracker = require('./schedulers/price_tracker');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/flighttrack';



// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB Connected!');
  
  // Start price tracker AFTER DB is ready
  const tracker = new PriceTracker();
  tracker.start();
  
  // Start Express server
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:3000`);
    console.log('Price tracking scheduler is active.');
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});