# Raiz Dating App - Quick Start Guide

## Installation

```bash
npm install
```

## Running the Example

```bash
node examples/usage-example.js
```

## Basic Usage

### 1. Create a User

```javascript
const { User } = require('./src');

const user = new User('user123', 'John Doe', 'john@example.com');
console.log(user.subscription.getTierName()); // "Raiz Basic"
```

### 2. Process Likes

```javascript
const { LikeManager } = require('./src/features/LikeManager');

// Check if user can like
if (user.canLike()) {
  const result = LikeManager.processLike(user, 'targetUser123');
  
  if (result.success) {
    console.log(`Like sent! ${result.remainingLikes} likes remaining today`);
  } else {
    // Show paywall
    const paywall = LimitReachedPaywall.getDailyLikeLimitPaywall();
    // Display paywall to user...
  }
}
```

### 3. Upgrade Subscription

```javascript
const { SubscriptionTiers } = require('./src/config/subscription-tiers');

// Upgrade to Plus
user.subscription.upgradeTo(
  SubscriptionTiers.SUBSCRIPTION_TIERS.PLUS,
  'monthly'
);

console.log(user.subscription.hasUnlimitedLikes()); // true
```

### 4. Purchase and Use Items

```javascript
const { PurchaseManager } = require('./src/features/PurchaseManager');

// Get boost purchase modal
const modal = PurchaseManager.getBoostPurchaseModal();

// After purchase completion
user.addToInventory('boosts', 5);

// Use a boost
if (user.useBoost()) {
  console.log('Boost activated! You\'re at the top of the grid!');
}
```

### 5. Display Paywalls

```javascript
const { OnboardingPaywall, LimitReachedPaywall } = require('./src');

// Onboarding paywall (first time user)
const onboarding = OnboardingPaywall.getPaywallContent();

// Limit reached paywall
const limitPaywall = LimitReachedPaywall.getDailyLikeLimitPaywall();

// Feature locked paywall
const incognitoPaywall = LimitReachedPaywall.getPaywall('incognito');
```

### 6. Grid Upsells

```javascript
const { GridUpsell } = require('./src/paywalls/GridUpsell');

// Check if upsell should be shown
if (GridUpsell.shouldShowUpsell(profilesSeen, lastUpsellAt)) {
  const card = GridUpsell.getRandomUpsellCard(userTier, profilesSeen);
  // Display upsell card in grid...
}
```

### 7. Post-Match Upsells

```javascript
const { PostMatchUpsell } = require('./src/paywalls/PostMatchUpsell');

// After getting a match
const upsell = PostMatchUpsell.getPostMatchUpsell({
  hasReachedLikeLimit: false,
  hasActiveBoost: false,
  subscriptionTier: user.subscription.tier,
  matchCount: user.matchCount
});

// Display upsell based on timing
if (upsell.timing === 'show-immediately') {
  // Show right after match animation
} else if (upsell.timing === 'show-after-delay') {
  setTimeout(() => {
    // Show after delay
  }, upsell.delay);
}
```

### 8. Settings & Upgrades

```javascript
const { SettingsUpgrade } = require('./src/paywalls/SettingsUpgrade');

// Get upgrade banner
const banner = SettingsUpgrade.getUpgradeBanner(user.subscription.tier);

// Get comparison table
const comparison = SettingsUpgrade.getComparisonTable();

// Get quick actions
const actions = SettingsUpgrade.getQuickActions(
  user.subscription.tier,
  user.inventory
);
```

## Key Concepts

### Subscription Tiers
Three tiers: Basic (free), Plus ($14.99/mo), Flame ($29.99/mo)

### Daily Limits
Basic users have 25 likes per day. Limits reset daily at midnight.

### Active Effects
Boosts and Highlights have time-limited effects that expire automatically.

### Visibility Multiplier
- Boost active: 10x visibility
- Highlight active: 3x visibility
- Grid priority (Plus): 2x visibility
- Grid priority (Flame): 5x visibility

### Inventory System
Users can purchase and store Boosts, Highlights, and Super Likes for later use.

## Feature Checks

```javascript
// Check specific features
user.subscription.hasUnlimitedLikes()     // true/false
user.subscription.canSeeWhoLikedYou()     // true/false
user.subscription.hasAdvancedFilters()    // true/false
user.subscription.canRewind()             // true/false
user.subscription.hasIncognitoMode()      // true/false
user.subscription.hasTravelMode()         // true/false

// Get feature summary
const features = user.subscription.getFeatures();
```

## Pricing Structure

### Monthly Billing
- Plus: $14.99/month
- Flame: $29.99/month

### 3-Month Billing (Save ~11%)
- Plus: $39.99 ($13.33/month)
- Flame: $79.99 ($26.66/month)

### 6-Month Billing (Save ~22%)
- Plus: $69.99 ($11.67/month)
- Flame: $139.99 ($23.33/month)

## Next Steps

1. **Integration**: Connect to your backend API
2. **Payment**: Integrate Stripe for payment processing
3. **UI**: Build frontend components for paywalls
4. **Analytics**: Track conversion funnels
5. **Testing**: Add unit and integration tests

For complete documentation, see [IMPLEMENTATION.md](./IMPLEMENTATION.md)
