/**
 * Subscription Model
 * Manages user subscription tiers and feature access
 */

const {
  SUBSCRIPTION_TIERS,
  TIER_NAMES,
  TIER_TAGLINES,
  TIER_PRICING,
  TIER_FEATURES
} = require('../config/subscription-tiers');

class Subscription {
  constructor(userId, tier = SUBSCRIPTION_TIERS.BASIC) {
    this.userId = userId;
    this.tier = tier;
    this.startDate = new Date();
    this.expiryDate = null;
    this.autoRenew = true;
    this.billingPeriod = null; // 'monthly', 'threeMonths', 'sixMonths'
  }

  /**
   * Get the human-readable name of the subscription tier
   */
  getTierName() {
    return TIER_NAMES[this.tier];
  }

  /**
   * Get the tagline for the subscription tier
   */
  getTierTagline() {
    return TIER_TAGLINES[this.tier];
  }

  /**
   * Get pricing information for the current tier
   */
  getPricing() {
    return TIER_PRICING[this.tier];
  }

  /**
   * Get all features available for the current tier
   */
  getFeatures() {
    return TIER_FEATURES[this.tier];
  }

  /**
   * Check if a specific feature is available
   */
  hasFeature(featureName) {
    const features = this.getFeatures();
    return features[featureName] === true || features[featureName] > 0;
  }

  /**
   * Get the daily like limit
   * Returns -1 for unlimited
   */
  getLikeLimit() {
    return TIER_FEATURES[this.tier].likesPerDay;
  }

  /**
   * Check if user has unlimited likes
   */
  hasUnlimitedLikes() {
    return TIER_FEATURES[this.tier].unlimitedLikes;
  }

  /**
   * Check if user can see who liked them
   */
  canSeeWhoLikedYou() {
    return TIER_FEATURES[this.tier].seeWhoLikedYou;
  }

  /**
   * Get number of boosts included in subscription
   */
  getBoostsIncluded() {
    return TIER_FEATURES[this.tier].boostsIncluded;
  }

  /**
   * Get boost frequency
   */
  getBoostFrequency() {
    return TIER_FEATURES[this.tier].boostFrequency;
  }

  /**
   * Get number of highlights included in subscription
   */
  getHighlightsIncluded() {
    return TIER_FEATURES[this.tier].highlightsIncluded;
  }

  /**
   * Check if user has advanced filters
   */
  hasAdvancedFilters() {
    return TIER_FEATURES[this.tier].advancedFilters;
  }

  /**
   * Check if user can rewind last skip
   */
  canRewind() {
    return TIER_FEATURES[this.tier].rewindLastSkip;
  }

  /**
   * Check if user has unlimited rewinds
   */
  hasUnlimitedRewinds() {
    return TIER_FEATURES[this.tier].unlimitedRewinds;
  }

  /**
   * Get grid priority level
   */
  getGridPriority() {
    return TIER_FEATURES[this.tier].priorityInGrid;
  }

  /**
   * Check if user has read receipts
   */
  hasReadReceipts() {
    return TIER_FEATURES[this.tier].readReceipts;
  }

  /**
   * Check if user has incognito mode
   */
  hasIncognitoMode() {
    return TIER_FEATURES[this.tier].incognitoMode;
  }

  /**
   * Check if user has travel mode
   */
  hasTravelMode() {
    return TIER_FEATURES[this.tier].travelMode;
  }

  /**
   * Check if subscription is active
   */
  isActive() {
    if (this.tier === SUBSCRIPTION_TIERS.BASIC) {
      return true; // Basic tier is always active
    }
    
    if (!this.expiryDate) {
      return false;
    }
    
    return new Date() < this.expiryDate;
  }

  /**
   * Upgrade to a new tier
   */
  upgradeTo(newTier, billingPeriod = 'monthly') {
    const tierOrder = [
      SUBSCRIPTION_TIERS.BASIC,
      SUBSCRIPTION_TIERS.PLUS,
      SUBSCRIPTION_TIERS.FLAME
    ];
    
    const currentIndex = tierOrder.indexOf(this.tier);
    const newIndex = tierOrder.indexOf(newTier);
    
    if (newIndex > currentIndex) {
      this.tier = newTier;
      this.billingPeriod = billingPeriod;
      this.startDate = new Date();
      this.setExpiryDate(billingPeriod);
      return true;
    }
    
    return false;
  }

  /**
   * Set expiry date based on billing period
   */
  setExpiryDate(billingPeriod) {
    const now = new Date();
    const expiry = new Date(now);
    
    switch (billingPeriod) {
      case 'monthly':
        expiry.setMonth(expiry.getMonth() + 1);
        break;
      case 'threeMonths':
        expiry.setMonth(expiry.getMonth() + 3);
        break;
      case 'sixMonths':
        expiry.setMonth(expiry.getMonth() + 6);
        break;
      default:
        expiry.setMonth(expiry.getMonth() + 1);
    }
    
    this.expiryDate = expiry;
  }

  /**
   * Get subscription summary
   */
  getSummary() {
    return {
      userId: this.userId,
      tier: this.tier,
      tierName: this.getTierName(),
      tagline: this.getTierTagline(),
      pricing: this.getPricing(),
      features: this.getFeatures(),
      isActive: this.isActive(),
      startDate: this.startDate,
      expiryDate: this.expiryDate,
      billingPeriod: this.billingPeriod,
      autoRenew: this.autoRenew
    };
  }
}

module.exports = Subscription;
