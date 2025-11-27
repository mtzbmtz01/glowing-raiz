const express = require('express');
const router = express.Router();
const userService = require('../services/UserService');

/**
 * POST /api/users
 * Create a new user
 */
router.post('/', (req, res) => {
  const { username, email } = req.body;
  
  if (!username || !email) {
    return res.status(400).json({ error: 'username and email are required' });
  }
  
  const user = userService.createUser(username, email);
  res.status(201).json(user);
});

/**
 * GET /api/users/:userId
 * Get user profile with monetization status
 */
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const profile = userService.getUserProfile(userId);
  
  if (!profile) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(profile);
});

/**
 * GET /api/users
 * Get all users
 */
router.get('/', (req, res) => {
  const users = userService.getAllUsers();
  res.json({ count: users.length, users });
});

/**
 * POST /api/users/:userId/like
 * Record a like (with limit checks)
 */
router.post('/:userId/like', (req, res) => {
  const { userId } = req.params;
  const result = userService.recordLike(userId);
  
  if (!result.success) {
    return res.status(403).json(result);
  }
  
  res.json(result);
});

module.exports = router;
