const cron = require('node-cron');
const Flight = require('../models/flight');
const PriceSnapshot = require('../models/priceSnapshot');

class PriceTracker {
  constructor() {
    this.isRunning = false;
    this.scheduler = null;
  }

  // Start the price tracking scheduler
  start() {
    if (this.scheduler) {
      console.log('[PriceTracker] Already running');
      return;
    }

    // Run every minute
    this.scheduler = cron.schedule('* * * * *', async () => {
      if (this.isRunning) return; // Prevent overlapping
      this.isRunning = true;

      try {
        console.log('[PriceTracker] Running price check...');
        await this.fetchPrices();
      } catch (error) {
        console.error('[PriceTracker] Error:', error);
      } finally {
        this.isRunning = false;
      }
    });

    console.log('[PriceTracker] Started - checking prices every minute');
  }

  // Stop the scheduler
  stop() {
    if (this.scheduler) {
      this.scheduler.stop();
      this.scheduler = null;
      console.log('[PriceTracker] Stopped');
    }
  }

  // Main price fetching logic
  async fetchPrices() {
    const now = new Date();
    const flights = await Flight.find({ 'tracking.enabled': true });

    for (const flight of flights) {
      const lastFetch = flight.tracking.lastFetchedAt || new Date(0);
      const interval = flight.tracking.interval || '1w';
      const timeDiffMs = now - new Date(lastFetch);

      // Check if we should fetch based on interval
      const shouldFetch = this.shouldFetchNow(interval, timeDiffMs);

      // Check if within tracking window
      const startDate = new Date(flight.flightDate);
      startDate.setDate(startDate.getDate() - (flight.tracking.startThresholdDaysBefore || 7));
      
      if (shouldFetch && now >= startDate) {
        await this.simulatePriceFetch(flight);
      }
    }
  }

  shouldFetchNow(interval, timeDiffMs) {
    const intervals = {
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000,
      '1w': 7 * 24 * 60 * 60 * 1000
    };
    return timeDiffMs >= (intervals[interval] || 60 * 60 * 1000);
  }

  async simulatePriceFetch(flight) {
    try {
      // Get last price or generate random base
      const lastSnapshot = await PriceSnapshot
        .findOne({ flightId: flight.flightId })
        .sort({ fetchedAt: -1 });

      const basePrice = lastSnapshot?.price || (Math.random() * 300 + 100);
      const newPrice = Math.max(20, Math.round((basePrice * (1 + (Math.random() - 0.5) / 10)) * 100) / 100);

      // Save new snapshot
      const snapshot = new PriceSnapshot({
        flightId: flight.flightId,
        fetchedAt: new Date(),
        price: newPrice,
        currency: 'USD',
        source: 'simulator'
      });
      await snapshot.save();

      // Update flight's last fetch time
      flight.tracking.lastFetchedAt = new Date();
      await flight.save();

      console.log(`[SIM] ${flight.flightId} -> $${newPrice}`);
    } catch (error) {
      console.error(`[PriceTracker] Failed to fetch ${flight.flightId}:`, error);
    }
  }
}

module.exports = PriceTracker;