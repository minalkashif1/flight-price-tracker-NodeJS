const Flight = require('../models/flight');
const PriceSnapshot = require('../models/priceSnapshot');

const hybridSearch = async (req, res) => {
  try {
    const { query, date, maxResults = 10 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // 1) Text search candidates
    const candidates = await Flight.find(
      { $text: { $search: query } }, 
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .limit(50);

    if (!candidates.length) {
      return res.json({ results: [], message: 'No flights found' });
    }

    // 2) Calculate composite scores
    let maxText = 0;
    candidates.forEach(c => { 
      if (c.score && c.score > maxText) maxText = c.score; 
    });

    const results = await Promise.all(
      candidates.map(async (candidate) => {
        // Get latest price snapshot
        const lastSnapshot = await PriceSnapshot
          .findOne({ flightId: candidate.flightId })
          .sort({ fetchedAt: -1 });

        // Calculate scores
        const recencyDays = lastSnapshot 
          ? ((Date.now() - new Date(lastSnapshot.flightDate)) / (1000*3600*24)) 
          : 9999;
        const recencyScore = Math.exp(-recencyDays / 30);
        const price = lastSnapshot?.price || null;
        const textNorm = (candidate.score || 0) / (maxText || 1);
        const priceScore = price ? 1 / (1 + price) : 0;
        
        const finalScore = 0.6 * textNorm + 0.2 * recencyScore + 0.2 * priceScore;

        return {
          flight: candidate,
          lastPrice: price,
          finalScore: Math.round(finalScore * 100) / 100
        };
      })
    );

    // 3) Sort and limit
    results.sort((a, b) => b.finalScore - a.finalScore);
    const topResults = results.slice(0, maxResults);

    res.json({ 
      query, 
      results: topResults, 
      totalCandidates: candidates.length 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { hybridSearch };