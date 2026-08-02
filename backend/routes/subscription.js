const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upgrade, switchPlan } = require('../controllers/subscriptionController');

// All subscription routes require authentication
router.use(auth);

router.post('/upgrade', upgrade);
router.post('/switch', switchPlan);

module.exports = router;
