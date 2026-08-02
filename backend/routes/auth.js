const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp, getMe, updateProfile, deleteAccount } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes — no auth required
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// Protected route — requires valid JWT
router.get('/me', auth, getMe);
router.put('/me', auth, updateProfile);
router.delete('/me', auth, deleteAccount);

module.exports = router;
