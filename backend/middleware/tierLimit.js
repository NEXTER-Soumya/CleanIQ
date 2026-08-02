const tierLimit = (req, res, next) => {
  if (req.user && req.user.datasetsCleanedCount >= 5 && req.user.activePlan !== 'pro') {
    return res.status(402).json({
      error: 'free_tier_exceeded',
      message: "You've used all 5 free dataset cleanings. Upgrade to CleanIQ Pro for unlimited access.",
      datasetsCleanedCount: req.user.datasetsCleanedCount,
      limit: 5
    });
  }
  next();
};

module.exports = tierLimit;
