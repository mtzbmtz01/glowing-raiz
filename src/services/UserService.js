const User = require('../models/User');
const monetizationService = require('./MonetizationService');

class UserService {
  constructor() {
    // In-memory storage for demo purposes
    this.users = new Map();
  }

  createUser(username, email) {
    const user = new User(username, email);
    this.users.set(user.id, user);
    return user;
  }

  getUser(userId) {
    return this.users.get(userId);
  }

  getAllUsers() {
    return Array.from(this.users.values());
  }

  updateUserPremiumStatus(userId, isPremium) {
    const user = this.users.get(userId);
    if (!user) {
      return null;
    }
    
    user.premiumTier = isPremium ? 'premium' : 'free';
    return user;
  }

  canUserLike(userId) {
    const user = this.users.get(userId);
    if (!user) {
      return false;
    }
    
    return user.canLike();
  }

  recordLike(userId) {
    const user = this.users.get(userId);
    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }
    
    if (!user.canLike()) {
      return {
        success: false,
        message: 'Daily like limit reached. Upgrade to Premium for unlimited likes!',
        likesRemaining: user.likesRemaining
      };
    }
    
    user.decrementLike();
    
    return {
      success: true,
      message: 'Like recorded',
      likesRemaining: user.isPremium() ? 'unlimited' : user.likesRemaining
    };
  }

  getUserProfile(userId) {
    const user = this.users.get(userId);
    if (!user) {
      return null;
    }
    
    const monetization = monetizationService.getUserMonetizationStatus(userId);
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      premiumTier: user.premiumTier,
      likesRemaining: user.isPremium() ? 'unlimited' : user.likesRemaining,
      monetization
    };
  }
}

module.exports = new UserService();
