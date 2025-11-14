/**
 * Limit Reached Paywall
 * Shown when users hit daily limits or try to access locked features
 */

const { SUBSCRIPTION_TIERS, TIER_NAMES } = require('../config/subscription-tiers');

class LimitReachedPaywall {
  /**
   * Daily like limit reached paywall
   */
  static getDailyLikeLimitPaywall() {
    return {
      type: 'like-limit',
      title: "You\'ve reached today\'s like limit",
      message: 'Unlock unlimited likes with Raiz Plus and never miss a connection.',
      icon: '💙',
      features: [
        'Unlimited likes every day',
        'See who liked you',
        '1 free Boost per week',
        'Advanced filters'
      ],
      cta: {
        primary: 'Upgrade to Raiz Plus',
        secondary: 'Maybe later',
        upgradeTo: SUBSCRIPTION_TIERS.PLUS
      }
    };
  }

  /**
   * "See who liked you" locked feature paywall
   */
  static getSeeWhoLikedYouPaywall(count = 0) {
    return {
      type: 'see-who-liked',
      title: 'See everyone who liked you',
      message: count > 0 
        ? `${count} people have liked you. Unlock Raiz Plus to see them all.`
        : 'Someone likes you! Unlock Raiz Plus to see who.',
      icon: '👀',
      visual: 'blurred-faces', // UI should show blurred profile images
      features: [
        'See everyone who liked you',
        'Unlimited likes',
        '1 free Boost per week',
        'Priority in grid'
      ],
      cta: {
        primary: 'Unlock Raiz Plus',
        secondary: 'Continue swiping',
        upgradeTo: SUBSCRIPTION_TIERS.PLUS
      }
    };
  }

  /**
   * Advanced filters locked paywall
   */
  static getAdvancedFiltersPaywall() {
    return {
      type: 'advanced-filters',
      title: 'Find exactly who you\'re looking for',
      message: 'Use advanced filters to match by lifestyle, interests, kids, intent, and more.',
      icon: '🔍',
      features: [
        'Filter by lifestyle & interests',
        'Filter by kids & family plans',
        'Filter by dating intent',
        'Unlimited likes',
        'See who liked you'
      ],
      cta: {
        primary: 'Get Raiz Plus',
        secondary: 'Not now',
        upgradeTo: SUBSCRIPTION_TIERS.PLUS
      }
    };
  }

  /**
   * Rewind feature locked paywall
   */
  static getRewindLockedPaywall() {
    return {
      type: 'rewind-locked',
      title: 'Undo your last skip',
      message: 'Change your mind? Rewind to go back and give them another chance.',
      icon: '↩️',
      features: [
        'Rewind your last skip',
        'Unlimited likes',
        'See who liked you',
        'Read receipts'
      ],
      cta: {
        primary: 'Get Raiz Plus',
        secondary: 'Continue',
        upgradeTo: SUBSCRIPTION_TIERS.PLUS
      }
    };
  }

  /**
   * Incognito mode locked paywall
   */
  static getIncognitoModePaywall() {
    return {
      type: 'incognito-locked',
      title: 'Browse privately',
      message: 'Only people you like will see your profile with Incognito Mode.',
      icon: '🕶️',
      features: [
        'Incognito mode',
        'Daily Boosts',
        'Unlimited rewinds',
        'Travel mode',
        'See last active'
      ],
      cta: {
        primary: 'Upgrade to Raiz Flame',
        secondary: 'Not now',
        upgradeTo: SUBSCRIPTION_TIERS.FLAME
      }
    };
  }

  /**
   * Travel mode locked paywall
   */
  static getTravelModePaywall() {
    return {
      type: 'travel-locked',
      title: 'Match anywhere in the world',
      message: 'Change your location to match with people in other cities.',
      icon: '✈️',
      features: [
        'Travel mode',
        'Daily Boosts',
        'Incognito mode',
        'Always top priority',
        'See online now'
      ],
      cta: {
        primary: 'Get Raiz Flame',
        secondary: 'Stay here',
        upgradeTo: SUBSCRIPTION_TIERS.FLAME
      }
    };
  }

  /**
   * Read receipts locked paywall
   */
  static getReadReceiptsPaywall() {
    return {
      type: 'read-receipts-locked',
      title: 'Know when they\'ve read your message',
      message: 'Get read receipts and better timing for your conversations.',
      icon: '✓✓',
      features: [
        'Read receipts in chat',
        'Unlimited likes',
        'See who liked you',
        '1 Boost per week'
      ],
      cta: {
        primary: 'Upgrade to Raiz Plus',
        secondary: 'Not now',
        upgradeTo: SUBSCRIPTION_TIERS.PLUS
      }
    };
  }

  /**
   * Get paywall by type
   */
  static getPaywall(type, metadata = {}) {
    switch (type) {
      case 'like-limit':
        return this.getDailyLikeLimitPaywall();
      case 'see-who-liked':
        return this.getSeeWhoLikedYouPaywall(metadata.count);
      case 'advanced-filters':
        return this.getAdvancedFiltersPaywall();
      case 'rewind':
        return this.getRewindLockedPaywall();
      case 'incognito':
        return this.getIncognitoModePaywall();
      case 'travel':
        return this.getTravelModePaywall();
      case 'read-receipts':
        return this.getReadReceiptsPaywall();
      default:
        return null;
    }
  }
}

module.exports = LimitReachedPaywall;
