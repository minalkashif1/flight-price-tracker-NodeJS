const express = require('express');
const router = express.Router();
const { createFlight, getFlights, getFlightById, updateFlight } = require('../controllers/flights');

router.post('/', createFlight);
router.get('/', getFlights);
router.get('/:flightId', getFlightById);
router.put('/:flightId', updateFlight);

module.exports = router;