const User = require('../models/User');
const Dataset = require('../models/Dataset');

exports.getLandingStats = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments();
    const datasetCount = await Dataset.countDocuments();
    
    // Calculate derived stats
    // Assume each dataset has an average of 50,000 data points (rows * cols)
    const dataPoints = datasetCount * 50000;
    // Assume each dataset cleaned saves about 2.5 hours of manual work
    const hoursSaved = Math.round(datasetCount * 2.5);

    res.json({
      success: true,
      data: {
        users: userCount,
        datasets: datasetCount,
        dataPoints,
        hoursSaved
      }
    });
  } catch (err) {
    next(err);
  }
};
