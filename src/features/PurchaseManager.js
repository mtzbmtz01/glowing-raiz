/**
 * Purchase Manager
 * Handles in-app purchases and Stripe checkout
 */

const {
  PURCHASE_TYPES,
  BOOST_PACKAGES,
  HIGHLIGHT_PACKAGES,
  SUPER_LIKE_PACKAGES
} = require('../config/in-app-purchases');

class PurchaseManager {
  /**
   * Process boost purchase
   */
  static processPurchase(user, packageId, paymentMethod = 'stripe') {
    const packageInfo = this.getPackageById(packageId);
    
    if (!packageInfo) {
      return {
        success: false,
        error: 'invalid-package',
        message: 'Package not found'
      };
    }

    // In real implementation, this would:
    // 1. Initiate Stripe checkout session
    // 2. Verify payment
    // 3. Add items to user inventory
    
    return {
      success: true,
      packageId,
      packageInfo,
      paymentMethod,
      // Stripe checkout URL would be returned here
      checkoutUrl: this.generateCheckoutUrl(packageId, paymentMethod),
      action: 'redirect-to-checkout'
    };
  }

  /**
   * Get package by ID
   */
  static getPackageById(packageId) {
    // Check boosts
    for (const [key, pkg] of Object.entries(BOOST_PACKAGES)) {
      if (pkg.id === packageId) {
        return { ...pkg, type: PURCHASE_TYPES.BOOST };
      }
    }
    
    // Check highlights
    for (const [key, pkg] of Object.entries(HIGHLIGHT_PACKAGES)) {
      if (pkg.id === packageId) {
        return { ...pkg, type: PURCHASE_TYPES.HIGHLIGHT };
      }
    }
    
    // Check super likes
    for (const [key, pkg] of Object.entries(SUPER_LIKE_PACKAGES)) {
      if (pkg.id === packageId) {
        return { ...pkg, type: PURCHASE_TYPES.SUPER_LIKE };
      }
    }
    
    return null;
  }

  /**
   * Generate checkout URL (mock for now)
   */
  static generateCheckoutUrl(packageId, paymentMethod) {
    return `https://checkout.stripe.com/session/${packageId}`;
  }

  /**
   * Complete purchase after payment confirmation
   */
  static completePurchase(user, packageId, transactionId) {
    const packageInfo = this.getPackageById(packageId);
    
    if (!packageInfo) {
      return {
        success: false,
        error: 'invalid-package'
      };
    }

    // Add items to user inventory
    let added = false;
    
    switch (packageInfo.type) {
      case PURCHASE_TYPES.BOOST:
        added = user.addToInventory('boosts', packageInfo.quantity);
        break;
      case PURCHASE_TYPES.HIGHLIGHT:
        added = user.addToInventory('highlights', packageInfo.quantity);
        break;
      case PURCHASE_TYPES.SUPER_LIKE:
        added = user.addToInventory('superLikes', packageInfo.quantity);
        break;
    }

    if (!added) {
      return {
        success: false,
        error: 'failed-to-add-inventory'
      };
    }

    return {
      success: true,
      packageInfo,
      transactionId,
      newInventory: user.inventory
    };
  }

  /**
   * Get boost purchase modal content
   */
  static getBoostPurchaseModal() {
    return {
      title: 'Boost My Raiz',
      description: 'Be at the top of the local grid for 30 minutes',
      icon: '🚀',
      packages: [
        {
          ...BOOST_PACKAGES.SINGLE,
          recommended: false
        },
        {
          ...BOOST_PACKAGES.PACK_5,
          recommended: true,
          savings: this.calculateSavings(BOOST_PACKAGES.PACK_5, BOOST_PACKAGES.SINGLE)
        },
        {
          ...BOOST_PACKAGES.PACK_10,
          recommended: false,
          savings: this.calculateSavings(BOOST_PACKAGES.PACK_10, BOOST_PACKAGES.SINGLE),
          badge: 'Best Value'
        }
      ],
      benefits: [
        'Get 10x more profile views',
        'Be seen first in your area',
        'Increase match rate',
        'Use anytime'
      ]
    };
  }

  /**
   * Get highlight purchase modal content
   */
  static getHighlightPurchaseModal() {
    return {
      title: 'Profile Highlight',
      description: 'Stand out with a colored border and glow for 24 hours',
      icon: '✨',
      packages: [
        {
          ...HIGHLIGHT_PACKAGES.SINGLE,
          recommended: false
        },
        {
          ...HIGHLIGHT_PACKAGES.PACK_5,
          recommended: true,
          savings: this.calculateSavings(HIGHLIGHT_PACKAGES.PACK_5, HIGHLIGHT_PACKAGES.SINGLE),
          badge: 'Best Value'
        }
      ],
      benefits: [
        'Colored border around your profile',
        'Glow effect to stand out',
        'Top row priority for 24 hours',
        '3x more profile views'
      ]
    };
  }

  /**
   * Get super like purchase modal content
   */
  static getSuperLikePurchaseModal() {
    return {
      title: 'Super Likes',
      description: 'Make your like stand out with a big animation',
      icon: '💙',
      packages: [
        {
          ...SUPER_LIKE_PACKAGES.PACK_5,
          recommended: false
        },
        {
          ...SUPER_LIKE_PACKAGES.PACK_20,
          recommended: true,
          savings: this.calculateSavings(SUPER_LIKE_PACKAGES.PACK_20, SUPER_LIKE_PACKAGES.PACK_5),
          badge: 'Best Value'
        }
      ],
      benefits: [
        'Stand out with big animation',
        'Priority position in their likes',
        '3x more likely to match',
        'Show you\'re serious'
      ]
    };
  }

  /**
   * Calculate savings percentage
   */
  static calculateSavings(package1, package2) {
    const pricePerUnit1 = package1.price / package1.quantity;
    const pricePerUnit2 = package2.price / package2.quantity;
    const savings = ((pricePerUnit2 - pricePerUnit1) / pricePerUnit2) * 100;
    return Math.round(savings);
  }

  /**
   * Get user\'s purchase history summary
   */
  static getPurchaseHistory(userId) {
    // In real implementation, this would fetch from database
    return {
      userId,
      totalSpent: 0,
      purchases: [],
      subscriptions: []
    };
  }

  /**
   * Restore previous purchases (for iOS/Android)
   */
  static restorePurchases(userId, platform) {
    // In real implementation, this would:
    // 1. Check with App Store / Play Store
    // 2. Verify previous purchases
    // 3. Restore items to inventory
    
    return {
      success: true,
      restored: {
        boosts: 0,
        highlights: 0,
        superLikes: 0
      },
      message: 'Purchases restored successfully'
    };
  }
}

module.exports = PurchaseManager;
