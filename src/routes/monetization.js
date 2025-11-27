const express = require('express');
const router = express.Router();
const monetizationService = require('../services/MonetizationService');
const userService = require('../services/UserService');

// Premium Boost Endpoints

/**
 * POST /api/monetization/boost
 * Purchase a profile boost
 */
router.post('/boost', (req, res) => {
  const { userId, durationMinutes } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }
  
  const duration = durationMinutes || 30;
  
  if (duration < 10 || duration > 180) {
    return res.status(400).json({ error: 'Duration must be between 10 and 180 minutes' });
  }
  
  const user = userService.getUser(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const result = monetizationService.purchaseBoost(userId, duration);
  res.json(result);
});

/**
 * GET /api/monetization/boost/:userId
 * Get active boosts for a user
 */
router.get('/boost/:userId', (req, res) => {
  const { userId } = req.params;
  const boosts = monetizationService.getActiveBoosts(userId);
  
  res.json({
    userId,
    activeBoosts: boosts.length,
    boosts
  });
});

// Profile Highlight Endpoints

/**
 * POST /api/monetization/highlight
 * Purchase a profile highlight
 */
router.post('/highlight', (req, res) => {
  const { userId, durationHours } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }
  
  const duration = durationHours || 24;
  
  if (duration < 1 || duration > 168) {
    return res.status(400).json({ error: 'Duration must be between 1 and 168 hours (1 week)' });
  }
  
  const user = userService.getUser(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const result = monetizationService.purchaseHighlight(userId, duration);
  res.json(result);
});

/**
 * GET /api/monetization/highlight/:userId
 * Get active highlights for a user
 */
router.get('/highlight/:userId', (req, res) => {
  const { userId } = req.params;
  const highlights = monetizationService.getActiveHighlights(userId);
  
  res.json({
    userId,
    activeHighlights: highlights.length,
    highlights
  });
});

// Premium Subscription Endpoints (Unlimited Likes)

/**
 * POST /api/monetization/premium
 * Purchase a premium subscription
 */
router.post('/premium', (req, res) => {
  const { userId, plan } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }
  
  const subscriptionPlan = plan || 'monthly';
  
  if (!['monthly', 'yearly'].includes(subscriptionPlan)) {
    return res.status(400).json({ error: 'Plan must be either "monthly" or "yearly"' });
  }
  
  const user = userService.getUser(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const result = monetizationService.purchasePremium(userId, subscriptionPlan);
  
  // Update user's premium status
  userService.updateUserPremiumStatus(userId, true);
  
  res.json(result);
});

/**
 * GET /api/monetization/premium/:userId
 * Get premium status for a user
 */
router.get('/premium/:userId', (req, res) => {
  const { userId } = req.params;
  const premiumStatus = monetizationService.getPremiumStatus(userId);
  
  res.json({
    userId,
    ...premiumStatus
  });
});

/**
 * DELETE /api/monetization/premium/:userId
 * Cancel premium subscription
 */
router.delete('/premium/:userId', (req, res) => {
  const { userId } = req.params;
  const result = monetizationService.cancelPremium(userId);
  
  if (result.success) {
    userService.updateUserPremiumStatus(userId, false);
  }
  
  res.json(result);
});

// General Status Endpoint

/**
 * GET /api/monetization/status/:userId
 * Get overall monetization status for a user
 */
router.get('/status/:userId', (req, res) => {
  const { userId } = req.params;
  const status = monetizationService.getUserMonetizationStatus(userId);
  
  res.json({
    userId,
    ...status
  });
});

module.exports = router;
