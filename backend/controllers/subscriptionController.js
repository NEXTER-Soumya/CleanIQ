const User = require('../models/User');

/**
 * POST /api/subscription/upgrade
 * 
 * MOCKED ENDPOINT — This is a fake payment flow for demo/college project purposes.
 * In production, this would integrate with a real payment gateway like Stripe,
 * Razorpay, or Paddle, verify the payment intent/charge, and only then update
 * the user's subscription status.
 * 
 * Currently: accepts any authenticated user, sets isSubscribed = true immediately.
 */
const upgrade = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If they don't have an active subscription, give them 30 days.
    // If they do, this just extends it or switches them to pro.
    const now = new Date();
    if (!user.subscriptionExpiry || user.subscriptionExpiry < now) {
      user.subscriptionExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 days
    }
    user.activePlan = 'pro';
    await user.save();

    res.json({
      message: 'Subscription upgraded to Pro! (mocked)',
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
 * POST /api/subscription/switch
 * 
 * Switches active plan between 'free' and 'pro'.
 */
const switchPlan = async (req, res, next) => {
  try {
    const { plan } = req.body; // 'free' or 'pro'
    const user = await User.findById(req.user._id);
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (plan !== 'free' && plan !== 'pro') return res.status(400).json({ error: 'Invalid plan' });

    if (plan === 'pro') {
      const now = new Date();
      if (!user.subscriptionExpiry || user.subscriptionExpiry < now) {
        return res.status(403).json({ error: 'Subscription expired. Please upgrade.' });
      }
    }

    user.activePlan = plan;
    await user.save();

    res.json({
      message: `Successfully switched to ${plan === 'pro' ? 'Pro' : 'Free'} plan.`,
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

module.exports = { upgrade, switchPlan };
