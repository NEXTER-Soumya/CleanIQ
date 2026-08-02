const express = require('express');
const router = express.Router();
const { getLandingStats } = require('../controllers/statsController');

router.get('/', getLandingStats);

module.exports = router;
