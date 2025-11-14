/**
 * Grid Upsell Cards
 * Promotional cards shown occasionally in the profile grid
 */

const { BOOST_PACKAGES, HIGHLIGHT_PACKAGES } = require('../config/in-app-purchases');

class GridUpsell {
  /**
   * Boost upsell card
   */
  static getBoostUpsellCard() {
    return {
      type: 'boost-upsell',
      title: 'Boost My Raiz',
      headline: 'Be seen first tonight',
      description: 'Get to the top of the local grid for 30 minutes',
      icon: '🚀',
      visual: 'rocket', // UI can show custom visual
      cta: {
        primary: 'Get a Boost',
        action: 'open-boost-purchase'
      },
      packages: [
        BOOST_PACKAGES.SINGLE,
        BOOST_PACKAGES.PACK_5,
        BOOST_PACKAGES.PACK_10
      ],
      displayFrequency: 'occasional' // Show every 20-30 profiles
    };
  }

  /**
   * Highlight upsell card
   */
  static getHighlightUpsellCard() {
    return {
      type: 'highlight-upsell',
      title: 'Profile Highlight',
      headline: 'Stand out from the crowd',
      description: 'Get a colored border and glow for 24 hours',
      icon: '✨',
      visual: 'glow', // UI can show profile with glow effect
      cta: {
        primary: 'Get Highlighted',
        action: 'open-highlight-purchase'
      },
      packages: [
        HIGHLIGHT_PACKAGES.SINGLE,
        HIGHLIGHT_PACKAGES.PACK_5
      ],
      displayFrequency: 'occasional' // Show every 25-35 profiles
    };
  }

  /**
   * Subscription upgrade card (Plus)
   */
  static getPlusUpgradeCard() {
    return {
      type: 'plus-upgrade',
      title: 'Raiz Plus',
      headline: 'Get unlimited likes',
      description: 'See who liked you, get weekly Boosts, and more',
      icon: '⭐',
      features: [
        'Unlimited likes',
        'See who liked you',
        '1 Boost per week'
      ],
      cta: {
        primary: 'Upgrade to Plus',
        action: 'open-subscription-upgrade',
        tier: 'raiz-plus'
      },
      displayFrequency: 'rare' // Show every 40-50 profiles
    };
  }

  /**
   * Subscription upgrade card (Flame)
   */
  static getFlameUpgradeCard() {
    return {
      type: 'flame-upgrade',
      title: 'Raiz Flame',
      headline: 'Own the grid',
      description: 'Daily Boosts, top priority, and exclusive features',
      icon: '🔥',
      features: [
        'Daily Boosts',
        'Always top priority',
        'Incognito mode'
      ],
      cta: {
        primary: 'Upgrade to Flame',
        action: 'open-subscription-upgrade',
        tier: 'raiz-flame'
      },
      displayFrequency: 'rare' // Show every 50-60 profiles
    };
  }

  /**
   * Get random upsell card based on user's current tier
   */
  static getRandomUpsellCard(userTier, profilesSeen) {
    const cards = [];
    
    // Always include in-app purchase cards
    if (profilesSeen % 25 === 0) {
      cards.push(this.getBoostUpsellCard());
    }
    
    if (profilesSeen % 30 === 0) {
      cards.push(this.getHighlightUpsellCard());
    }
    
    // Add subscription cards based on current tier
    if (userTier === 'raiz-basic' && profilesSeen % 45 === 0) {
      cards.push(this.getPlusUpgradeCard());
    }
    
    if (userTier !== 'raiz-flame' && profilesSeen % 55 === 0) {
      cards.push(this.getFlameUpgradeCard());
    }
    
    // Return random card from available options
    if (cards.length > 0) {
      return cards[Math.floor(Math.random() * cards.length)];
    }
    
    return null;
  }

  /**
   * Determine if upsell card should be shown
   */
  static shouldShowUpsell(profilesSeen, lastUpsellAt) {
    const minProfilesBetweenUpsells = 15;
    const profilesSinceLastUpsell = profilesSeen - lastUpsellAt;
    
    return profilesSinceLastUpsell >= minProfilesBetweenUpsells;
  }
}

module.exports = GridUpsell;
