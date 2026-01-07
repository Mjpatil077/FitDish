const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/chefs', require('./routes/chefs'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/recipes', require('./routes/recipes'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/watch-history', require('./routes/watchHistory'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/analytics', require('./routes/analytics'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'FitDish API is running' });
});

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitdish';

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    
    // Auto-seed if database is empty
    const User = require('./models/User');
    const Category = require('./models/Category');
    const userCount = await User.countDocuments();
    const categoryCount = await Category.countDocuments();
    
    if (userCount === 0 || categoryCount === 0) {
      console.log('📦 Database is empty, running seed script...');
      const { exec } = require('child_process');
      exec('node seed/seed.js', (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Seeding error:', error);
        } else {
          console.log(stdout);
        }
      });
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;

