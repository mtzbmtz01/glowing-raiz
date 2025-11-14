/**
 * Raiz In-App Purchases Configuration
 * A la carte purchases: Boosts, Highlights, and Super Likes
 */

const PURCHASE_TYPES = {
  BOOST: 'boost',
  HIGHLIGHT: 'highlight',
  SUPER_LIKE: 'super-like'
};

/**
 * Boost Packages - "Boost My Raiz"
 * Function: Top of local grid for 30 minutes
 */
const BOOST_PACKAGES = {
  SINGLE: {
    id: 'boost-1',
    name: 'Single Boost',
    description: 'Top of local grid for 30 minutes',
    quantity: 1,
    price: 4.99,
    durationMinutes: 30
  },
  PACK_5: {
    id: 'boost-5',
    name: '5 Boosts',
    description: '5 boosts to use anytime',
    quantity: 5,
    price: 19.99,
    durationMinutes: 30
  },
  PACK_10: {
    id: 'boost-10',
    name: '10 Boosts',
    description: '10 boosts to use anytime',
    quantity: 10,
    price: 34.99,
    durationMinutes: 30
  }
};

/**
 * Highlight Packages - "Profile Highlight"
 * Function: Colored border + glow + top-row priority for 24 hours
 */
const HIGHLIGHT_PACKAGES = {
  SINGLE: {
    id: 'highlight-1',
    name: 'Single Highlight',
    description: 'Stand out with a colored border for 24 hours',
    quantity: 1,
    price: 3.99,
    durationHours: 24
  },
  PACK_5: {
    id: 'highlight-5',
    name: '5 Highlights',
    description: '5 highlights to use anytime',
    quantity: 5,
    price: 14.99,
    durationHours: 24
  }
};

/**
 * Super Like Packages
 * Function: Makes your like stand out with big animation and priority position
 */
const SUPER_LIKE_PACKAGES = {
  PACK_5: {
    id: 'super-like-5',
    name: '5 Super Likes',
    description: 'Make your like stand out',
    quantity: 5,
    price: 4.99
  },
  PACK_20: {
    id: 'super-like-20',
    name: '20 Super Likes',
    description: '20 Super Likes to use anytime',
    quantity: 20,
    price: 14.99
  }
};

/**
 * All available in-app purchases
 */
const ALL_PURCHASES = {
  boosts: BOOST_PACKAGES,
  highlights: HIGHLIGHT_PACKAGES,
  superLikes: SUPER_LIKE_PACKAGES
};

module.exports = {
  PURCHASE_TYPES,
  BOOST_PACKAGES,
  HIGHLIGHT_PACKAGES,
  SUPER_LIKE_PACKAGES,
  ALL_PURCHASES
};
