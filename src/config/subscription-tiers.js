/**
 * Raiz Subscription Tiers Configuration
 * Defines the three main subscription tiers and their features
 */

const SUBSCRIPTION_TIERS = {
  BASIC: 'raiz-basic',
  PLUS: 'raiz-plus',
  FLAME: 'raiz-flame'
};

const TIER_NAMES = {
  [SUBSCRIPTION_TIERS.BASIC]: 'Raiz Basic',
  [SUBSCRIPTION_TIERS.PLUS]: 'Raiz Plus',
  [SUBSCRIPTION_TIERS.FLAME]: 'Raiz Flame'
};

const TIER_TAGLINES = {
  [SUBSCRIPTION_TIERS.BASIC]: 'Get rooted, start meeting.',
  [SUBSCRIPTION_TIERS.PLUS]: 'Be seen first.',
  [SUBSCRIPTION_TIERS.FLAME]: 'Own the grid.'
};

/**
 * Pricing in USD for each tier
 * Structure: { monthly, threeMonths, sixMonths }
 */
const TIER_PRICING = {
  [SUBSCRIPTION_TIERS.BASIC]: {
    monthly: 0,
    threeMonths: 0,
    sixMonths: 0
  },
  [SUBSCRIPTION_TIERS.PLUS]: {
    monthly: 14.99,
    threeMonths: 39.99,
    sixMonths: 69.99
  },
  [SUBSCRIPTION_TIERS.FLAME]: {
    monthly: 29.99,
    threeMonths: 79.99,
    sixMonths: 139.99
  }
};

/**
 * Feature limits and availability per tier
 */
const TIER_FEATURES = {
  [SUBSCRIPTION_TIERS.BASIC]: {
    likesPerDay: 25,
    unlimitedLikes: false,
    seeWhoLikedYou: false,
    boostsIncluded: 0,
    boostFrequency: 'none',
    highlightsIncluded: 0,
    highlightFrequency: 'none',
    advancedFilters: false,
    rewindLastSkip: false,
    unlimitedRewinds: false,
    priorityInGrid: 'none',
    readReceipts: false,
    incognitoMode: false,
    travelMode: false,
    chatAccess: 'mutuals-only' // Only with mutual matches
  },
  [SUBSCRIPTION_TIERS.PLUS]: {
    likesPerDay: -1, // -1 represents unlimited
    unlimitedLikes: true,
    seeWhoLikedYou: true,
    boostsIncluded: 1,
    boostFrequency: 'weekly',
    highlightsIncluded: 1,
    highlightFrequency: 'monthly',
    advancedFilters: true,
    rewindLastSkip: true,
    unlimitedRewinds: false,
    priorityInGrid: 'medium',
    readReceipts: true,
    incognitoMode: false,
    travelMode: false,
    chatAccess: 'unlimited'
  },
  [SUBSCRIPTION_TIERS.FLAME]: {
    likesPerDay: -1, // -1 represents unlimited
    unlimitedLikes: true,
    seeWhoLikedYou: true,
    boostsIncluded: 1,
    boostFrequency: 'daily',
    highlightsIncluded: 3,
    highlightFrequency: 'monthly',
    advancedFilters: true,
    rewindLastSkip: true,
    unlimitedRewinds: true,
    priorityInGrid: 'high',
    readReceipts: true,
    incognitoMode: true,
    travelMode: true,
    chatAccess: 'unlimited',
    seeLastActive: true,
    seeOnlineNow: true
  }
};

module.exports = {
  SUBSCRIPTION_TIERS,
  TIER_NAMES,
  TIER_TAGLINES,
  TIER_PRICING,
  TIER_FEATURES
};
