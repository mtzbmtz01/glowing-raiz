/**
 * User Model
 * Manages user profile and tracks daily usage limits
 */

const Subscription = require('./Subscription');
const { SUBSCRIPTION_TIERS } = require('../config/subscription-tiers');

class User {
  constructor(userId, name, email) {
    this.userId = userId;
    this.name = name;
    this.email = email;
    this.subscription = new Subscription(userId, SUBSCRIPTION_TIERS.BASIC);
    
    // Usage tracking
    this.dailyUsage = {
      likesUsed: 0,
      rewindsUsed: 0,
      lastResetDate: new Date().toDateString()
    };
    
    // Inventory for purchased items
    this.inventory = {
      boosts: 0,
      highlights: 0,
      superLikes: 0
    };
    
    // Active effects
    this.activeEffects = {
      boostActive: false,
      boostExpiresAt: null,
      highlightActive: false,
      highlightExpiresAt: null,
      incognitoMode: false,
      travelMode: false,
      travelLocation: null
    };
  }

  /**
   * Reset daily usage counters (should be called daily)
   */
  resetDailyUsage() {
    const today = new Date().toDateString();
    
    if (this.dailyUsage.lastResetDate !== today) {
      this.dailyUsage.likesUsed = 0;
      this.dailyUsage.rewindsUsed = 0;
      this.dailyUsage.lastResetDate = today;
    }
  }

  /**
   * Check if user can like another profile
   */
  canLike() {
    this.resetDailyUsage();
    
    if (this.subscription.hasUnlimitedLikes()) {
      return true;
    }
    
    const limit = this.subscription.getLikeLimit();
    return this.dailyUsage.likesUsed < limit;
  }

  /**
   * Record a like action
   */
  recordLike() {
    this.resetDailyUsage();
    
    if (!this.canLike()) {
      return false;
    }
    
    this.dailyUsage.likesUsed++;
    return true;
  }

  /**
   * Get remaining likes for today
   */
  getRemainingLikes() {
    this.resetDailyUsage();
    
    if (this.subscription.hasUnlimitedLikes()) {
      return -1; // Unlimited
    }
    
    const limit = this.subscription.getLikeLimit();
    return Math.max(0, limit - this.dailyUsage.likesUsed);
  }

  /**
   * Check if user can rewind (undo last skip)
   */
  canRewind() {
    if (this.subscription.hasUnlimitedRewinds()) {
      return true;
    }
    
    if (!this.subscription.canRewind()) {
      return false;
    }
    
    this.resetDailyUsage();
    return this.dailyUsage.rewindsUsed < 1; // One rewind per day for Plus
  }

  /**
   * Record a rewind action
   */
  recordRewind() {
    if (!this.canRewind()) {
      return false;
    }
    
    this.dailyUsage.rewindsUsed++;
    return true;
  }

  /**
   * Add items to inventory
   */
  addToInventory(itemType, quantity) {
    if (this.inventory.hasOwnProperty(itemType)) {
      this.inventory[itemType] += quantity;
      return true;
    }
    return false;
  }

  /**
   * Use a boost
   */
  useBoost() {
    if (this.inventory.boosts <= 0) {
      return false;
    }
    
    this.inventory.boosts--;
    this.activeEffects.boostActive = true;
    
    // Boost lasts 30 minutes
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);
    this.activeEffects.boostExpiresAt = expiresAt;
    
    return true;
  }

  /**
   * Use a highlight
   */
  useHighlight() {
    if (this.inventory.highlights <= 0) {
      return false;
    }
    
    this.inventory.highlights--;
    this.activeEffects.highlightActive = true;
    
    // Highlight lasts 24 hours
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    this.activeEffects.highlightExpiresAt = expiresAt;
    
    return true;
  }

  /**
   * Use a super like
   */
  useSuperLike() {
    if (this.inventory.superLikes <= 0) {
      return false;
    }
    
    this.inventory.superLikes--;
    return true;
  }

  /**
   * Check if boost is currently active
   */
  hasActiveBoost() {
    if (!this.activeEffects.boostActive) {
      return false;
    }
    
    if (new Date() > this.activeEffects.boostExpiresAt) {
      this.activeEffects.boostActive = false;
      this.activeEffects.boostExpiresAt = null;
      return false;
    }
    
    return true;
  }

  /**
   * Check if highlight is currently active
   */
  hasActiveHighlight() {
    if (!this.activeEffects.highlightActive) {
      return false;
    }
    
    if (new Date() > this.activeEffects.highlightExpiresAt) {
      this.activeEffects.highlightActive = false;
      this.activeEffects.highlightExpiresAt = null;
      return false;
    }
    
    return true;
  }

  /**
   * Toggle incognito mode (Flame tier only)
   */
  toggleIncognitoMode() {
    if (!this.subscription.hasIncognitoMode()) {
      return false;
    }
    
    this.activeEffects.incognitoMode = !this.activeEffects.incognitoMode;
    return true;
  }

  /**
   * Set travel location (Flame tier only)
   */
  setTravelLocation(location) {
    if (!this.subscription.hasTravelMode()) {
      return false;
    }
    
    this.activeEffects.travelMode = true;
    this.activeEffects.travelLocation = location;
    return true;
  }

  /**
   * Disable travel mode
   */
  disableTravelMode() {
    this.activeEffects.travelMode = false;
    this.activeEffects.travelLocation = null;
    return true;
  }

  /**
   * Get user summary
   */
  getSummary() {
    return {
      userId: this.userId,
      name: this.name,
      email: this.email,
      subscription: this.subscription.getSummary(),
      dailyUsage: this.dailyUsage,
      inventory: this.inventory,
      activeEffects: this.activeEffects,
      remainingLikes: this.getRemainingLikes()
    };
  }
}

module.exports = User;
