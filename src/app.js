const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const monetizationRoutes = require('./routes/monetization');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/monetization', monetizationRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Glowing Raiz Dating App API',
    version: '1.0.0',
    features: [
      'Premium Boosts - Increase profile visibility',
      'Unlimited Likes - Premium subscription removes daily like limits',
      'Profile Highlights - Feature your profile prominently'
    ],
    endpoints: {
      users: {
        'POST /api/users': 'Create a new user',
        'GET /api/users': 'Get all users',
        'GET /api/users/:userId': 'Get user profile',
        'POST /api/users/:userId/like': 'Record a like (with limit checks)'
      },
      monetization: {
        boosts: {
          'POST /api/monetization/boost': 'Purchase a profile boost',
          'GET /api/monetization/boost/:userId': 'Get active boosts'
        },
        highlights: {
          'POST /api/monetization/highlight': 'Purchase a profile highlight',
          'GET /api/monetization/highlight/:userId': 'Get active highlights'
        },
        premium: {
          'POST /api/monetization/premium': 'Purchase premium subscription',
          'GET /api/monetization/premium/:userId': 'Get premium status',
          'DELETE /api/monetization/premium/:userId': 'Cancel premium subscription'
        },
        'GET /api/monetization/status/:userId': 'Get overall monetization status'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
