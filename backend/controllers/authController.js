const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/Otp');

const JWT_SECRET = process.env.JWT_SECRET || 'cleaniq-dev-secret-change-in-production';
const JWT_EXPIRES_IN = '7d';
const OTP_EXPIRY_MINUTES = 5;

/**
 * Generate a random 6-digit OTP
 */
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * POST /api/auth/send-otp
 * Accepts { phoneNumber }, generates a 6-digit OTP, saves with 5-min expiry.
 * 
 * MOCK FLOW: Returns the OTP directly in the response as "devOtp"
 * since we're not sending real SMS. In production, this would integrate
 * with Twilio/MSG91/etc. and NOT return the OTP in the response.
 */
const sendOtp = async (req, res, next) => {
  try {
    const { phoneNumber, mode } = req.body;

    if (!phoneNumber || phoneNumber.trim().length < 10) {
      return res.status(400).json({
        error: 'invalid_phone',
        message: 'Please provide a valid phone number (at least 10 digits).'
      });
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');

    const userExists = await User.exists({ phoneNumber: cleanPhone });
    if (mode === 'signup' && userExists) {
      return res.status(400).json({ message: 'An account with this number already exists. Please log in.' });
    }
    if (mode === 'login' && !userExists) {
      return res.status(400).json({ message: 'No account found with this number. Please sign up.' });
    }

    // Remove any existing OTPs for this phone number
    await Otp.deleteMany({ phoneNumber: cleanPhone });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await Otp.create({
      phoneNumber: cleanPhone,
      otp,
      expiresAt
    });

    res.json({
      message: 'OTP sent successfully',
      // DEV ONLY: In production, remove devOtp from the response.
      // The OTP would be sent via SMS and never exposed to the client.
      devOtp: otp,
      expiresInSeconds: OTP_EXPIRY_MINUTES * 60
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/verify-otp
 * Accepts { phoneNumber, otp }, verifies match + expiry,
 * creates user if new, issues JWT.
 */
const verifyOtp = async (req, res, next) => {
  try {
    const { phoneNumber, otp, realName } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({
        error: 'missing_fields',
        message: 'Phone number and OTP are required.'
      });
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');

    const otpRecord = await Otp.findOne({
      phoneNumber: cleanPhone,
      otp
    });

    if (!otpRecord) {
      return res.status(401).json({
        error: 'invalid_otp',
        message: 'Invalid OTP. Please check and try again.'
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(401).json({
        error: 'expired_otp',
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // OTP is valid — clean up
    await Otp.deleteMany({ phoneNumber: cleanPhone });

    // Find or create user
    let user = await User.findOne({ phoneNumber: cleanPhone });
    if (!user) {
      user = await User.create({ phoneNumber: cleanPhone, realName: realName || '' });
    }

    // Auto-downgrade if subscription expired
    if (user.activePlan === 'pro' && (!user.subscriptionExpiry || user.subscriptionExpiry < new Date())) {
      user.activePlan = 'free';
      await user.save();
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, phoneNumber: user.phoneNumber },
      JWT_SECRET,
      { expiresIn: '7d' } // Token valid for 7 days
    );

    res.json({
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        username: user.username,
        profession: user.profession,
        profilePicture: user.profilePicture,
        realName: user.realName,
        subscriptionExpiry: user.subscriptionExpiry,
        activePlan: user.activePlan,
        datasetsCleanedCount: user.datasetsCleanedCount
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Returns the current authenticated user's info.
 * Requires valid JWT via auth middleware.
 */
const getMe = async (req, res) => {
  // Auto-downgrade if subscription expired
  if (req.user.activePlan === 'pro' && (!req.user.subscriptionExpiry || req.user.subscriptionExpiry < new Date())) {
    req.user.activePlan = 'free';
    await req.user.save();
  }

  res.json({
    user: {
      id: req.user._id,
      phoneNumber: req.user.phoneNumber,
      username: req.user.username,
      realName: req.user.realName,
      profession: req.user.profession,
      profilePicture: req.user.profilePicture,
      subscriptionExpiry: req.user.subscriptionExpiry,
      activePlan: req.user.activePlan,
      datasetsCleanedCount: req.user.datasetsCleanedCount
    }
  });
};

const updateProfile = async (req, res, next) => {
  try {
    const { username, profession, profilePicture } = req.body;
    
    // We don't allow updating phoneNumber or realName here as requested
    if (username !== undefined) req.user.username = username;
    if (profession !== undefined) req.user.profession = profession;
    if (profilePicture !== undefined) req.user.profilePicture = profilePicture;
    
    await req.user.save();

    // Auto-downgrade if subscription expired
    if (req.user.activePlan === 'pro' && (!req.user.subscriptionExpiry || req.user.subscriptionExpiry < new Date())) {
      req.user.activePlan = 'free';
      await req.user.save();
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: req.user._id,
        phoneNumber: req.user.phoneNumber,
        username: req.user.username,
        realName: req.user.realName,
        profession: req.user.profession,
        profilePicture: req.user.profilePicture,
        subscriptionExpiry: req.user.subscriptionExpiry,
        activePlan: req.user.activePlan,
        datasetsCleanedCount: req.user.datasetsCleanedCount
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const Dataset = require('../models/Dataset');
    const DatasetColumn = require('../models/DatasetColumn');
    const Insight = require('../models/Insight');

    const datasets = await Dataset.find({ userId });
    const datasetIds = datasets.map(d => d._id);

    await DatasetColumn.deleteMany({ datasetId: { $in: datasetIds } });
    await Insight.deleteMany({ datasetId: { $in: datasetIds } });
    await Dataset.deleteMany({ userId });

    await User.deleteOne({ _id: userId });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendOtp, verifyOtp, getMe, updateProfile, deleteAccount };
