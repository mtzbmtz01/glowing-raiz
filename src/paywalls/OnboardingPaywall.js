/**
 * Onboarding Paywall
 * Shown to users before they hit the grid for the first time
 */

const {
  SUBSCRIPTION_TIERS,
  TIER_NAMES,
  TIER_TAGLINES,
  TIER_PRICING,
  TIER_FEATURES
} = require('../config/subscription-tiers');

class OnboardingPaywall {
  /**
   * Get paywall content for onboarding
   */
  static getPaywallContent() {
    return {
      title: 'Get more out of Raiz',
      description: 'Choose the plan that works best for you',
      tiers: [
        {
          id: SUBSCRIPTION_TIERS.BASIC,
          name: TIER_NAMES[SUBSCRIPTION_TIERS.BASIC],
          tagline: TIER_TAGLINES[SUBSCRIPTION_TIERS.BASIC],
          pricing: TIER_PRICING[SUBSCRIPTION_TIERS.BASIC],
          features: this.formatFeatures(SUBSCRIPTION_TIERS.BASIC),
          highlighted: false
        },
        {
          id: SUBSCRIPTION_TIERS.PLUS,
          name: TIER_NAMES[SUBSCRIPTION_TIERS.PLUS],
          tagline: TIER_TAGLINES[SUBSCRIPTION_TIERS.PLUS],
          pricing: TIER_PRICING[SUBSCRIPTION_TIERS.PLUS],
          features: this.formatFeatures(SUBSCRIPTION_TIERS.PLUS),
          highlighted: true, // Default pre-selected
          badge: 'Most Popular'
        },
        {
          id: SUBSCRIPTION_TIERS.FLAME,
          name: TIER_NAMES[SUBSCRIPTION_TIERS.FLAME],
          tagline: TIER_TAGLINES[SUBSCRIPTION_TIERS.FLAME],
          pricing: TIER_PRICING[SUBSCRIPTION_TIERS.FLAME],
          features: this.formatFeatures(SUBSCRIPTION_TIERS.FLAME),
          highlighted: false,
          badge: 'Premium'
        }
      ],
      cta: {
        primary: 'Start Raiz Plus',
        secondary: 'Continue with Basic'
      }
    };
  }

  /**
   * Format features for display
   */
  static formatFeatures(tier) {
    const features = TIER_FEATURES[tier];
    const formatted = [];

    // Likes
    if (features.unlimitedLikes) {
      formatted.push('Unlimited likes');
    } else {
      formatted.push(`${features.likesPerDay} likes per day`);
    }

    // See who liked you
    if (features.seeWhoLikedYou) {
      formatted.push('See who liked you');
    }

    // Boosts
    if (features.boostsIncluded > 0) {
      const frequency = features.boostFrequency === 'daily' ? 'day' : 'week';
      formatted.push(`${features.boostsIncluded} Boost per ${frequency}`);
    }

    // Highlights
    if (features.highlightsIncluded > 0) {
      formatted.push(`${features.highlightsIncluded} Highlight${features.highlightsIncluded > 1 ? 's' : ''} per month`);
    }

    // Advanced features
    if (features.advancedFilters) {
      formatted.push('Advanced filters');
    }

    if (features.rewindLastSkip) {
      if (features.unlimitedRewinds) {
        formatted.push('Unlimited rewinds');
      } else {
        formatted.push('Rewind last skip');
      }
    }

    if (features.readReceipts) {
      formatted.push('Read receipts');
    }

    if (features.priorityInGrid !== 'none') {
      const priority = features.priorityInGrid === 'high' ? 'Always' : 'Medium';
      formatted.push(`${priority} priority in grid`);
    }

    // Premium features
    if (features.incognitoMode) {
      formatted.push('Incognito mode');
    }

    if (features.travelMode) {
      formatted.push('Travel mode');
    }

    if (features.seeLastActive) {
      formatted.push('See last active / online now');
    }

    return formatted;
  }

  /**
   * Get billing period options
   */
  static getBillingPeriods(tier) {
    const pricing = TIER_PRICING[tier];
    
    if (tier === SUBSCRIPTION_TIERS.BASIC) {
      return [];
    }

    return [
      {
        id: 'monthly',
        label: '1 Month',
        price: pricing.monthly,
        pricePerMonth: pricing.monthly,
        savings: null
      },
      {
        id: 'threeMonths',
        label: '3 Months',
        price: pricing.threeMonths,
        pricePerMonth: (pricing.threeMonths / 3).toFixed(2),
        savings: ((pricing.monthly * 3 - pricing.threeMonths) / (pricing.monthly * 3) * 100).toFixed(0) + '%'
      },
      {
        id: 'sixMonths',
        label: '6 Months',
        price: pricing.sixMonths,
        pricePerMonth: (pricing.sixMonths / 6).toFixed(2),
        savings: ((pricing.monthly * 6 - pricing.sixMonths) / (pricing.monthly * 6) * 100).toFixed(0) + '%',
        badge: 'Best Value'
      }
    ];
  }
}

module.exports = OnboardingPaywall;
