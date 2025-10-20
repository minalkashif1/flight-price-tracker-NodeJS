const express = require('express');
const router = express.Router();
const { getFlightPrices } = require('../controllers/prices');

router.get('/:flightId', getFlightPrices);

module.exports = router;