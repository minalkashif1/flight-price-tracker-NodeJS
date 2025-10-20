# Flight Price Tracking System

A Node.js + MongoDB based system that tracks and analyzes flight ticket prices over time, supports automated updates, and provides an intelligent hybrid search for flights using text, price, and recency ranking.

---

## Features

### 1. Flight Management
- Create, view, and update flights.
- Each flight stores route, airline, and schedule information.

### 2. Price Tracking Automation
- Cron scheduler automatically simulates new ticket prices at fixed intervals.
- Prices are stored with timestamps to show price trends over time.

### 3. Price History API
- Retrieve all historical prices for any flight.

### 4. Intelligent Hybrid Search (Bonus)
- Combines text relevance, recency, and price score into one weighted ranking formula:
  ```
  finalScore = 0.6 * textNorm + 0.2 * recencyScore + 0.2 * priceScore
  ```
- Returns the best matching and most relevant flights first.

### 5. Optimized Indexing
- Text index for smart searching on flight routes and airlines.
- Compound indexes on `flightId` and timestamps for efficient queries.

---

## Folder Structure

```
├── config/
│   └── db.js                # MongoDB connection
├── controllers/
│   ├── flights.js           # Flight CRUD logic
│   ├── prices.js            # Get price history
│   └── search.js            # Hybrid search logic
├── models/
│   ├── flight.js            # Flight schema + indexes
│   └── priceSnapshot.js     # Price snapshot schema
├── routes/
│   ├── flights.js           # /flights endpoints
│   ├── prices.js            # /prices endpoints
│   └── search.js            # /search endpoint
├── schedulers/
│   └── priceTracker.js      # Cron job for tracking
├── seed.js                  # Sample flight + price seeder
├── app.js                   # Express app setup
├── server.js                # Entry point (starts app)
└── .env                     # Environment variables
```

---

## Installation & Setup

### 1. Clone the project
```bash
git clone <your-repo-url>
cd flight-price-tracker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment
Create a `.env` file:
```
MONGO_URI=mongodb://127.0.0.1:27017/flightTracker
PORT=3000
```

### 4. Seed database
```bash
node seed.js
```

### 5. Run the server
```bash
node server.js
```
Server will run at → http://localhost:3000

---

## API Endpoints

### Flights
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/flights` | Add a new flight |
| GET  | `/flights` | Get all flights |
| GET  | `/flights/:flightId` | Get specific flight |
| PUT  | `/flights/:flightId` | Update flight info |

### Prices
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/prices/:flightId` | Get historical price data for a flight |

### Search (Bonus)
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/search` | Hybrid search by route, airline, or city name |

Example body:
```json
{
  "query": "LHE BKK",
  "maxResults": 5
}
```

---

## Scheduler (Automation)
- Cron job runs periodically to simulate real-time price updates.
- New price data automatically appended to each flight’s history.

---

## Bonus Achieved
- Implemented hybrid search ranking combining:
  - Full-text search
  - Recent flight data
  - Price normalization
- Demonstrates indexing, automation, and weighted scoring in MongoDB.

---

## Technologies Used
- Node.js + Express.js  
- MongoDB + Mongoose  
- Node-Cron  
- dotenv for environment management  

---

## Future Enhancements
- Real airline API integration  
- Price visualization dashboard  
- Authentication for user-based tracking  
