/**
 * Like Manager
 * Handles like functionality with tier-based limits
 */

const { SUBSCRIPTION_TIERS } = require('../config/subscription-tiers');

class LikeManager {
  /**
   * Process a like action
   */
  static processLike(user, targetUserId, isSuperLike = false) {
    // Check if it's a super like and user has inventory
    if (isSuperLike) {
      if (!user.useSuperLike()) {
        return {
          success: false,
          error: 'no-super-likes',
          message: 'You have no Super Likes available',
          action: 'purchase-super-likes'
        };
      }
    }

    // Check if user can like
    if (!user.canLike()) {
      return {
        success: false,
        error: 'like-limit-reached',
        message: "You\'ve reached your daily like limit",
        remainingLikes: 0,
        action: 'show-upgrade-paywall'
      };
    }

    // Record the like
    const recorded = user.recordLike();
    
    if (!recorded) {
      return {
        success: false,
        error: 'like-failed',
        message: 'Failed to record like'
      };
    }

    return {
      success: true,
      targetUserId,
      isSuperLike,
      remainingLikes: user.getRemainingLikes(),
      shouldShowUpsell: this.shouldShowLikeUpsell(user)
    };
  }

  /**
   * Get like status for user
   */
  static getLikeStatus(user) {
    const remaining = user.getRemainingLikes();
    const isUnlimited = user.subscription.hasUnlimitedLikes();
    
    return {
      unlimited: isUnlimited,
      remaining: remaining,
      limit: user.subscription.getLikeLimit(),
      percentageUsed: isUnlimited ? 0 : ((user.dailyUsage.likesUsed / user.subscription.getLikeLimit()) * 100),
      shouldShowWarning: !isUnlimited && remaining <= 5,
      shouldShowPaywall: remaining === 0
    };
  }

  /**
   * Determine if upsell should be shown based on usage
   */
  static shouldShowLikeUpsell(user) {
    if (user.subscription.hasUnlimitedLikes()) {
      return false;
    }

    const remaining = user.getRemainingLikes();
    const limit = user.subscription.getLikeLimit();
    
    // Show upsell when user has used 80% of their likes
    return remaining <= (limit * 0.2);
  }

  /**
   * Get like limit warning
   */
  static getLikeLimitWarning(user) {
    const remaining = user.getRemainingLikes();
    
    if (user.subscription.hasUnlimitedLikes()) {
      return null;
    }

    if (remaining === 0) {
      return {
        type: 'limit-reached',
        message: "You\'ve used all your likes for today",
        action: 'upgrade-to-unlimited'
      };
    }

    if (remaining <= 5) {
      return {
        type: 'warning',
        message: `Only ${remaining} likes left today`,
        action: 'show-upgrade-option'
      };
    }

    return null;
  }

  /**
   * Calculate match probability boost from active effects
   */
  static getMatchProbabilityMultiplier(user) {
    let multiplier = 1.0;
    
    // Boost active
    if (user.hasActiveBoost()) {
      multiplier *= 10; // 10x visibility during boost
    }
    
    // Highlight active
    if (user.hasActiveHighlight()) {
      multiplier *= 3; // 3x visibility with highlight
    }
    
    // Grid priority from subscription
    const priority = user.subscription.getGridPriority();
    if (priority === 'medium') {
      multiplier *= 2;
    } else if (priority === 'high') {
      multiplier *= 5;
    }
    
    return multiplier;
  }

  /**
   * Get visibility status
   */
  static getVisibilityStatus(user) {
    const baseMultiplier = this.getMatchProbabilityMultiplier(user);
    
    return {
      multiplier: baseMultiplier,
      boostActive: user.hasActiveBoost(),
      highlightActive: user.hasActiveHighlight(),
      gridPriority: user.subscription.getGridPriority(),
      description: this.getVisibilityDescription(baseMultiplier)
    };
  }

  /**
   * Get human-readable visibility description
   */
  static getVisibilityDescription(multiplier) {
    if (multiplier >= 10) {
      return 'Maximum visibility - You\'re at the top!';
    } else if (multiplier >= 5) {
      return 'High visibility - You\'re being seen first';
    } else if (multiplier >= 3) {
      return 'Increased visibility - Standing out';
    } else if (multiplier >= 2) {
      return 'Medium visibility - Above average';
    } else {
      return 'Standard visibility';
    }
  }
}

module.exports = LikeManager;
