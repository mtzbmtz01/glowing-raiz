/**
 * Post-Match Upsell
 * Shown after user gets a match, especially when at limits or with low visibility
 */

const { SUBSCRIPTION_TIERS } = require('../config/subscription-tiers');

class PostMatchUpsell {
  /**
   * Get post-match upsell message
   */
  static getPostMatchUpsell(userContext = {}) {
    const { 
      hasReachedLikeLimit = false,
      hasActiveBoost = false,
      subscriptionTier = SUBSCRIPTION_TIERS.BASIC,
      matchCount = 0
    } = userContext;

    // Different messages based on user context
    if (hasReachedLikeLimit) {
      return {
        type: 'post-match-limit',
        title: '🎉 New Match!',
        message: "Matches like this happen more when you\'re at the top of the grid. Try Raiz Plus.",
        submessage: "You\'ve used all your likes for today. Upgrade to keep matching.",
        features: [
          'Unlimited likes',
          'See who liked you',
          '1 Boost per week'
        ],
        cta: {
          primary: 'Upgrade to Raiz Plus',
          secondary: 'Continue chatting',
          upgradeTo: SUBSCRIPTION_TIERS.PLUS
        },
        timing: 'show-immediately' // Show right after match animation
      };
    }

    if (!hasActiveBoost && subscriptionTier === SUBSCRIPTION_TIERS.BASIC) {
      return {
        type: 'post-match-boost',
        title: '🎉 You got a match!',
        message: 'Want more matches like this? Get seen by 10x more people with a Boost.',
        submessage: 'Be at the top of the grid for 30 minutes.',
        icon: '🚀',
        cta: {
          primary: 'Try a Boost',
          secondary: 'Maybe later',
          action: 'open-boost-purchase'
        },
        timing: 'show-after-delay', // Show after 2-3 seconds
        delay: 2000
      };
    }

    if (matchCount > 0 && matchCount % 5 === 0 && subscriptionTier === SUBSCRIPTION_TIERS.BASIC) {
      return {
        type: 'post-match-milestone',
        title: `🎉 ${matchCount} matches!`,
        message: 'You\'re doing great! Get even more matches with Raiz Plus.',
        submessage: 'Unlimited likes, see who liked you, and priority in the grid.',
        features: [
          'Unlimited likes every day',
          'See who liked you first',
          'Weekly Boosts',
          'Advanced filters'
        ],
        cta: {
          primary: 'Upgrade to Raiz Plus',
          secondary: 'Keep swiping',
          upgradeTo: SUBSCRIPTION_TIERS.PLUS
        },
        timing: 'show-after-delay',
        delay: 3000
      };
    }

    // Default: Subtle upsell
    return {
      type: 'post-match-subtle',
      title: '🎉 New Match!',
      banner: {
        message: 'Get more matches with Raiz Plus',
        cta: 'Learn more',
        action: 'open-subscription-info'
      },
      timing: 'show-as-banner', // Show as dismissible banner at bottom
      displayDuration: 5000
    };
  }

  /**
   * Determine if post-match upsell should be shown
   */
  static shouldShowUpsell(matchCount, lastUpsellMatch) {
    // Don't show upsell for every match - space them out
    const minMatchesBetweenUpsells = 3;
    const matchesSinceLastUpsell = matchCount - lastUpsellMatch;
    
    return matchesSinceLastUpsell >= minMatchesBetweenUpsells;
  }

  /**
   * Get context-aware timing for upsell
   */
  static getUpsellTiming(userEngagement) {
    const { 
      matchResponseRate = 0,
      averageTimeOnApp = 0,
      daysActive = 0
    } = userEngagement;

    // More engaged users see less aggressive upsells
    if (matchResponseRate > 0.7 && averageTimeOnApp > 20) {
      return {
        frequency: 'low',
        style: 'subtle'
      };
    }

    // Less engaged users see more prominent upsells
    if (daysActive < 3) {
      return {
        frequency: 'high',
        style: 'prominent'
      };
    }

    return {
      frequency: 'medium',
      style: 'balanced'
    };
  }
}

module.exports = PostMatchUpsell;
