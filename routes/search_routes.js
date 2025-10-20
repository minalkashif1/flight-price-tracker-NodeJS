const express = require('express');
const router = express.Router();
const { hybridSearch } = require('../controllers/search');

router.post('/', hybridSearch);

module.exports = router;