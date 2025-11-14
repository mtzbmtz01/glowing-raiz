const Boost = require('../models/Boost');
const ProfileHighlight = require('../models/ProfileHighlight');
const PremiumSubscription = require('../models/PremiumSubscription');

class MonetizationService {
  constructor() {
    // In-memory storage for demo purposes
    this.boosts = new Map();
    this.highlights = new Map();
    this.subscriptions = new Map();
  }

  // Premium Boost Methods
  purchaseBoost(userId, durationMinutes = 30) {
    const boost = new Boost(userId, durationMinutes);
    
    if (!this.boosts.has(userId)) {
      this.boosts.set(userId, []);
    }
    
    this.boosts.get(userId).push(boost);
    
    return {
      success: true,
      boost,
      message: `Boost purchased for ${durationMinutes} minutes at $${boost.price.toFixed(2)}`
    };
  }

  getActiveBoosts(userId) {
    if (!this.boosts.has(userId)) {
      return [];
    }
    
    const now = new Date();
    return this.boosts.get(userId).filter(boost => 
      boost.active && boost.expiresAt > now
    );
  }

  getAllBoosts(userId) {
    return this.boosts.get(userId) || [];
  }

  // Profile Highlight Methods
  purchaseHighlight(userId, durationHours = 24) {
    const highlight = new ProfileHighlight(userId, durationHours);
    
    if (!this.highlights.has(userId)) {
      this.highlights.set(userId, []);
    }
    
    this.highlights.get(userId).push(highlight);
    
    return {
      success: true,
      highlight,
      message: `Profile highlight purchased for ${durationHours} hours at $${highlight.price.toFixed(2)}`
    };
  }

  getActiveHighlights(userId) {
    if (!this.highlights.has(userId)) {
      return [];
    }
    
    const now = new Date();
    return this.highlights.get(userId).filter(highlight => 
      highlight.active && highlight.expiresAt > now
    );
  }

  getAllHighlights(userId) {
    return this.highlights.get(userId) || [];
  }

  // Premium Subscription Methods (Unlimited Likes)
  purchasePremium(userId, plan = 'monthly') {
    const subscription = new PremiumSubscription(userId, plan);
    this.subscriptions.set(userId, subscription);
    
    return {
      success: true,
      subscription,
      message: `Premium ${plan} subscription activated at $${subscription.price.toFixed(2)}`
    };
  }

  getPremiumStatus(userId) {
    const subscription = this.subscriptions.get(userId);
    
    if (!subscription) {
      return {
        isPremium: false,
        hasUnlimitedLikes: false
      };
    }
    
    const isActive = subscription.isActive();
    
    return {
      isPremium: isActive,
      hasUnlimitedLikes: isActive,
      subscription: isActive ? subscription : null
    };
  }

  cancelPremium(userId) {
    const subscription = this.subscriptions.get(userId);
    
    if (!subscription) {
      return {
        success: false,
        message: 'No active subscription found'
      };
    }
    
    subscription.cancel();
    
    return {
      success: true,
      message: 'Premium subscription cancelled'
    };
  }

  // General monetization statistics
  getUserMonetizationStatus(userId) {
    const premiumStatus = this.getPremiumStatus(userId);
    const activeBoosts = this.getActiveBoosts(userId);
    const activeHighlights = this.getActiveHighlights(userId);
    
    return {
      premium: premiumStatus,
      activeBoosts: activeBoosts.length,
      activeHighlights: activeHighlights.length,
      boosts: activeBoosts,
      highlights: activeHighlights
    };
  }
}

module.exports = new MonetizationService();
