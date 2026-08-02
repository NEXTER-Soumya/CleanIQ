const mongoose = require('mongoose');

const getHealth = (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    dbState: mongoose.connection.readyState
  });
};

module.exports = { getHealth };
