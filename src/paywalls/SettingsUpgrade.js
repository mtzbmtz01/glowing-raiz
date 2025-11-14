/**
 * Settings & Profile Upgrade
 * Upgrade banners and options shown in Settings/Profile screens
 */

const {
  SUBSCRIPTION_TIERS,
  TIER_NAMES,
  TIER_TAGLINES,
  TIER_PRICING
} = require('../config/subscription-tiers');

class SettingsUpgrade {
  /**
   * Get upgrade banner for settings page
   */
  static getUpgradeBanner(currentTier) {
    if (currentTier === SUBSCRIPTION_TIERS.FLAME) {
      return null; // No upgrade banner for top tier
    }

    const upgradeTier = currentTier === SUBSCRIPTION_TIERS.BASIC 
      ? SUBSCRIPTION_TIERS.PLUS 
      : SUBSCRIPTION_TIERS.FLAME;

    const tierName = TIER_NAMES[upgradeTier];
    const tagline = TIER_TAGLINES[upgradeTier];
    const pricing = TIER_PRICING[upgradeTier];

    return {
      type: 'settings-banner',
      currentTier,
      upgradeTier,
      title: `Upgrade to ${tierName}`,
      tagline,
      price: `Starting at $${pricing.monthly}/month`,
      benefits: this.getBenefitsForTier(upgradeTier),
      cta: {
        primary: 'View Plans',
        secondary: 'Restore Purchases',
        action: 'open-subscription-plans'
      },
      style: 'prominent' // Full-width banner with gradient
    };
  }

  /**
   * Get benefits list for a tier
   */
  static getBenefitsForTier(tier) {
    const benefits = {
      [SUBSCRIPTION_TIERS.BASIC]: [
        '25 likes per day',
        'Access to core grid',
        'Chat with mutuals'
      ],
      [SUBSCRIPTION_TIERS.PLUS]: [
        'Unlimited likes',
        'See who liked you',
        '1 Boost per week',
        '1 Highlight per month',
        'Advanced filters',
        'Rewind last skip',
        'Read receipts'
      ],
      [SUBSCRIPTION_TIERS.FLAME]: [
        'Everything in Plus',
        'Daily Boosts',
        'Unlimited rewinds',
        'Always top priority',
        'Incognito mode',
        'Travel mode',
        'See last active / online'
      ]
    };

    return benefits[tier] || [];
  }

  /**
   * Get subscription management options
   */
  static getSubscriptionOptions(currentTier) {
    return {
      currentTier,
      tierName: TIER_NAMES[currentTier],
      options: [
        {
          id: 'view-plans',
          label: 'View All Plans',
          icon: '💎',
          action: 'open-subscription-plans',
          visible: true
        },
        {
          id: 'manage-subscription',
          label: 'Manage Subscription',
          icon: '⚙️',
          action: 'open-subscription-management',
          visible: currentTier !== SUBSCRIPTION_TIERS.BASIC
        },
        {
          id: 'restore-purchases',
          label: 'Restore Purchases',
          icon: '🔄',
          action: 'restore-purchases',
          visible: true
        },
        {
          id: 'purchase-history',
          label: 'Purchase History',
          icon: '📜',
          action: 'open-purchase-history',
          visible: currentTier !== SUBSCRIPTION_TIERS.BASIC
        }
      ].filter(option => option.visible)
    };
  }

  /**
   * Get tier comparison table
   */
  static getComparisonTable() {
    return {
      title: 'Compare Plans',
      description: 'Choose the plan that works best for you',
      features: [
        {
          category: 'Matching',
          items: [
            {
              feature: 'Daily likes',
              basic: '25',
              plus: 'Unlimited',
              flame: 'Unlimited'
            },
            {
              feature: 'See who liked you',
              basic: false,
              plus: true,
              flame: true
            },
            {
              feature: 'Priority in grid',
              basic: 'Standard',
              plus: 'Medium',
              flame: 'Always first'
            }
          ]
        },
        {
          category: 'Boosts & Highlights',
          items: [
            {
              feature: 'Boosts included',
              basic: 'None',
              plus: '1/week',
              flame: '1/day'
            },
            {
              feature: 'Highlights included',
              basic: 'None',
              plus: '1/month',
              flame: '3/month'
            }
          ]
        },
        {
          category: 'Features',
          items: [
            {
              feature: 'Advanced filters',
              basic: false,
              plus: true,
              flame: true
            },
            {
              feature: 'Rewind',
              basic: false,
              plus: 'Once',
              flame: 'Unlimited'
            },
            {
              feature: 'Read receipts',
              basic: false,
              plus: true,
              flame: true
            },
            {
              feature: 'Incognito mode',
              basic: false,
              plus: false,
              flame: true
            },
            {
              feature: 'Travel mode',
              basic: false,
              plus: false,
              flame: true
            }
          ]
        }
      ],
      tiers: [
        {
          id: SUBSCRIPTION_TIERS.BASIC,
          name: TIER_NAMES[SUBSCRIPTION_TIERS.BASIC],
          price: 'Free'
        },
        {
          id: SUBSCRIPTION_TIERS.PLUS,
          name: TIER_NAMES[SUBSCRIPTION_TIERS.PLUS],
          price: '$14.99/mo',
          highlighted: true
        },
        {
          id: SUBSCRIPTION_TIERS.FLAME,
          name: TIER_NAMES[SUBSCRIPTION_TIERS.FLAME],
          price: '$29.99/mo'
        }
      ]
    };
  }

  /**
   * Get quick actions for current tier
   */
  static getQuickActions(currentTier, inventory) {
    const actions = [];

    // Show buy boosts if not Flame or low inventory
    if (currentTier !== SUBSCRIPTION_TIERS.FLAME || inventory.boosts < 3) {
      actions.push({
        id: 'buy-boosts',
        title: 'Buy Boosts',
        description: 'Get to the top of the grid',
        icon: '🚀',
        action: 'open-boost-purchase'
      });
    }

    // Show buy highlights if inventory low
    if (inventory.highlights < 2) {
      actions.push({
        id: 'buy-highlights',
        title: 'Buy Highlights',
        description: 'Stand out with a glow',
        icon: '✨',
        action: 'open-highlight-purchase'
      });
    }

    // Show upgrade action if not on top tier
    if (currentTier !== SUBSCRIPTION_TIERS.FLAME) {
      const upgradeTier = currentTier === SUBSCRIPTION_TIERS.BASIC 
        ? SUBSCRIPTION_TIERS.PLUS 
        : SUBSCRIPTION_TIERS.FLAME;
      
      actions.push({
        id: 'upgrade-tier',
        title: `Upgrade to ${TIER_NAMES[upgradeTier]}`,
        description: TIER_TAGLINES[upgradeTier],
        icon: upgradeTier === SUBSCRIPTION_TIERS.PLUS ? '⭐' : '🔥',
        action: 'open-subscription-upgrade',
        highlighted: true
      });
    }

    return actions;
  }
}

module.exports = SettingsUpgrade;
