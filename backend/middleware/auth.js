const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'cleaniq-dev-secret-change-in-production';

/**
 * JWT Authentication Middleware
 * 
 * Checks for a Bearer token in the Authorization header,
 * verifies it, and attaches the user to req.user.
 * 
 * Falls back to a default mock user ONLY if no token is provided
 * AND we're in development mode — this allows the dataset routes
 * to work during early development without auth.
 */
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
          return res.status(401).json({
            error: 'user_not_found',
            message: 'User associated with this token no longer exists.'
          });
        }

        req.user = user;
        return next();
      } catch (jwtError) {
        return res.status(401).json({
          error: 'invalid_token',
          message: 'Invalid or expired authentication token.'
        });
      }
    }

    // No token provided — check for dev fallback
    if (process.env.NODE_ENV === 'development') {
      // DEV ONLY: Create/find a default test user so routes work without auth
      let defaultUser = await User.findOne({ phoneNumber: '1234567890' });
      if (!defaultUser) {
        defaultUser = await User.create({ phoneNumber: '1234567890' });
      }
      req.user = defaultUser;
      return next();
    }

    // Production: no token = unauthorized
    return res.status(401).json({
      error: 'no_token',
      message: 'Authentication required. Please log in.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
