// server.js
require('dotenv').config();          
const app = require('./app');        
const PriceTracker = require('./schedulers/price_tracker');  // Scheduler class

// Create and start the price tracker
const tracker = new PriceTracker();
tracker.start();  

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Price tracking scheduler is active.`);
});
