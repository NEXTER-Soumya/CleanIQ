require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const connectDB = require('./config/db');
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const datasetRoutes = require('./routes/datasets');
const subscriptionRoutes = require('./routes/subscription');
const statsRoutes = require('./routes/stats');
const errorHandler = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Routes
// Auth routes are public (no JWT required to send/verify OTP)
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/datasets', datasetRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/stats', statsRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
