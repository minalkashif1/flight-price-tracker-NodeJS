// seed.js
const mongoose = require('mongoose');

const FlightSchema = new mongoose.Schema({
  flightId: { type: String, unique: true },
  route: { from: String, to: String },
  airline: String,
  flightDate: Date,
  tracking: {
    enabled: Boolean,
    startThresholdDaysBefore: Number,
    interval: String,
    lastFetchedAt: Date
  },
  metadata: Object,
  createdAt: Date
});
const PriceSnapshotSchema = new mongoose.Schema({
  flightId: String,
  fetchedAt: Date,
  price: Number,
  currency: String,
  source: String
});
const Flight = mongoose.model('Flight_seed', FlightSchema, 'flights');
const Snapshot = mongoose.model('PriceSnapshot_seed', PriceSnapshotSchema, 'price_snapshots');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/flighttrack');

  // Clear old
  await Flight.deleteMany({});
  await Snapshot.deleteMany({});

  const flights = [
    { flightId:'F001', route:{from:'LHE', to:'BKK'}, airline:'AirExample', flightDate: new Date('2026-01-15'), tracking:{enabled:true, startThresholdDaysBefore:180, interval:'1w'}, metadata:{cabin:'economy'}, createdAt: new Date() },
    { flightId:'F002', route:{from:'SIN', to:'BKK'}, airline:'BudgetSky', flightDate: new Date('2025-12-05'), tracking:{enabled:true, startThresholdDaysBefore:90, interval:'1d'}, metadata:{cabin:'economy'}, createdAt: new Date() },
    { flightId:'F003', route:{from:'LHE', to:'JED'}, airline:'RoyalAir', flightDate: new Date('2025-11-20'), tracking:{enabled:true, startThresholdDaysBefore:60, interval:'1w'}, metadata:{cabin:'business'}, createdAt: new Date() },
    { flightId:'F004', route:{from:'DXB', to:'LHR'}, airline:'SkyConnect', flightDate: new Date('2026-02-10'), tracking:{enabled:true, startThresholdDaysBefore:120, interval:'1w'}, metadata:{cabin:'economy'}, createdAt: new Date() },
    { flightId:'F005', route:{from:'KHI', to:'IST'}, airline:'EasternAir', flightDate: new Date('2025-12-25'), tracking:{enabled:true, startThresholdDaysBefore:90, interval:'1d'}, metadata:{cabin:'economy'}, createdAt: new Date() },
    { flightId:'F006', route:{from:'LHE', to:'DXB'}, airline:'AirExample', flightDate: new Date('2026-03-05'), tracking:{enabled:true, startThresholdDaysBefore:180, interval:'1w'}, metadata:{cabin:'economy'}, createdAt: new Date() },
    { flightId:'F007', route:{from:'BKK', to:'SIN'}, airline:'BudgetSky', flightDate: new Date('2026-01-01'), tracking:{enabled:true, startThresholdDaysBefore:120, interval:'1d'}, metadata:{cabin:'economy'}, createdAt: new Date() },
    { flightId:'F008', route:{from:'JED', to:'LHE'}, airline:'RoyalAir', flightDate: new Date('2025-11-28'), tracking:{enabled:true, startThresholdDaysBefore:60, interval:'1w'}, metadata:{cabin:'business'}, createdAt: new Date() },
    { flightId:'F009', route:{from:'SIN', to:'HKG'}, airline:'AsiaFly', flightDate: new Date('2026-02-20'), tracking:{enabled:true, startThresholdDaysBefore:120, interval:'1w'}, metadata:{cabin:'economy'}, createdAt: new Date() },
    { flightId:'F010', route:{from:'LHE', to:'CPE'}, airline:'IslandAir', flightDate: new Date('2026-04-01'), tracking:{enabled:true, startThresholdDaysBefore:180, interval:'1w'}, metadata:{cabin:'economy'}, createdAt: new Date() }
  ];

  await Flight.insertMany(flights);

  // Create some initial snapshots for each flight (3 each)
  const snapshots = [];
  flights.forEach((f, i) => {
    const base = 100 + i*30 + Math.round(Math.random()*200);
    snapshots.push({ flightId: f.flightId, fetchedAt: new Date('2025-10-15T00:00:00Z'), price: Math.round(base*100)/100, currency:'USD', source:'simulator' });
    snapshots.push({ flightId: f.flightId, fetchedAt: new Date('2025-11-01T00:00:00Z'), price: Math.round((base*(1+Math.random()*0.1))*100)/100, currency:'USD', source:'simulator' });
    snapshots.push({ flightId: f.flightId, fetchedAt: new Date('2025-11-15T00:00:00Z'), price: Math.round((base*(1+Math.random()*0.2))*100)/100, currency:'USD', source:'simulator' });
  });

  await Snapshot.insertMany(snapshots);

  console.log('Seed complete: 10 flights + snapshots inserted.');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
