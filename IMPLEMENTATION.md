# Raiz Dating App - Subscription System Implementation

## Overview

This implementation provides a complete three-tier subscription system for the Raiz dating app with in-app purchases and strategic paywall flows.

## Subscription Tiers

### 1. Raiz Basic (Free)
**Tagline:** "Get rooted, start meeting."

**Features:**
- Access to core grid & profiles
- 25 likes per day
- Limited chat (mutuals only)
- Standard profile visibility

**Pricing:** Free

### 2. Raiz Plus (Main Subscription)
**Tagline:** "Be seen first."

**Features:**
- Unlimited likes
- See who liked you
- 1 free Boost per week
- 1 free Super Highlight per month
- Advanced filters (lifestyle, interests, kids, intent)
- Read receipts in chat
- Rewind last skip (undo)
- Medium priority in grid

**Pricing:**
- Monthly: $14.99
- 3 Months: $39.99
- 6 Months: $69.99

### 3. Raiz Flame (Premium)
**Tagline:** "Own the grid."

**Features:**
- Everything in Plus, plus:
- Always prioritized in grid ranking
- Daily Boost (1 every 24 hours)
- Unlimited rewinds
- See last active / online now
- Incognito mode (browse privately)
- Travel mode (change location)
- 3 Highlights per month

**Pricing:**
- Monthly: $29.99
- 3 Months: $79.99
- 6 Months: $139.99

## In-App Purchases (À La Carte)

### Boosts - "Boost My Raiz"
**Function:** Top of local grid for 30 minutes

**Packages:**
- 1 Boost: $4.99
- 5 Boosts: $19.99 (20% savings)
- 10 Boosts: $34.99 (30% savings)

### Highlights - "Profile Highlight"
**Function:** Colored border + glow + top-row priority for 24 hours

**Packages:**
- 1 Highlight: $3.99
- 5 Highlights: $14.99 (25% savings)

### Super Likes
**Function:** Makes your like stand out with big animation and priority position

**Packages:**
- 5 Super Likes: $4.99
- 20 Super Likes: $14.99 (25% savings)

## Feature Matrix

| Feature | Basic | Raiz Plus | Raiz Flame |
|---------|-------|-----------|------------|
| Likes per day | 25 | Unlimited | Unlimited |
| See who liked you | No | Yes | Yes |
| Boosts included | None | 1/week | 1/day |
| Highlights included | None | 1/month | 3/month |
| Advanced filters | No | Yes | Yes |
| Rewind last skip | No | Yes | Unlimited |
| Priority in grid | No | Medium | High |
| Read receipts | No | Yes | Yes |
| Incognito mode | No | No | Yes |
| Travel mode | No | No | Yes |

## Upgrade Flow & Paywalls

### A. Onboarding Paywall
**When:** Before user hits grid for first time

**Content:**
- Screen title: "Get more out of Raiz"
- Three columns showing all tiers
- Default pre-selected: Raiz Plus monthly
- Primary CTA: "Start Raiz Plus"
- Secondary CTA: "Continue with Basic" (low contrast)

**Implementation:**
```javascript
const { OnboardingPaywall } = require('./src/paywalls/OnboardingPaywall');
const paywallContent = OnboardingPaywall.getPaywallContent();
```

### B. "You Hit a Limit" Paywalls
**Trigger:** When users reach limits or try locked features

**Types:**
1. **Daily Like Limit**
   - Message: "You've reached today's like limit. Unlock unlimited likes with Raiz Plus."
   
2. **See Who Liked You**
   - Visual: Blurred profile faces
   - Message: "See everyone who liked you with Raiz Plus."
   
3. **Advanced Filters**
   - Message: "Find exactly who you're looking for with advanced filters."
   
4. **Rewind**
   - Message: "Undo your last skip with Raiz Plus."

5. **Incognito Mode** (Flame only)
   - Message: "Browse privately with Raiz Flame."

6. **Travel Mode** (Flame only)
   - Message: "Match anywhere in the world with Raiz Flame."

**Implementation:**
```javascript
const { LimitReachedPaywall } = require('./src/paywalls/LimitReachedPaywall');
const paywall = LimitReachedPaywall.getPaywall('like-limit');
```

### C. Grid Upsell Cards
**Trigger:** Occasionally shown in profile grid (every 20-30 profiles)

**Types:**
1. Boost upsell: "Be seen first tonight – try Boost My Raiz"
2. Highlight upsell: "Stand out from the crowd"
3. Subscription upgrade cards

**Implementation:**
```javascript
const { GridUpsell } = require('./src/paywalls/GridUpsell');
const upsellCard = GridUpsell.getRandomUpsellCard(userTier, profilesSeen);
```

### D. Settings / Profile Upgrade
**Location:** Settings or Profile screen

**Components:**
- Banner: "Upgrade to Raiz Plus or Raiz Flame for more matches"
- Buttons: "View plans" | "Restore purchases"
- Comparison table
- Quick actions

**Implementation:**
```javascript
const { SettingsUpgrade } = require('./src/paywalls/SettingsUpgrade');
const banner = SettingsUpgrade.getUpgradeBanner(currentTier);
const comparisonTable = SettingsUpgrade.getComparisonTable();
```

### E. Post-Match Upsell
**Trigger:** After getting a match, especially when at limits

**Message:** "Matches like this happen more when you're at the top of the grid. Try Raiz Plus."

**Implementation:**
```javascript
const { PostMatchUpsell } = require('./src/paywalls/PostMatchUpsell');
const upsell = PostMatchUpsell.getPostMatchUpsell({
  hasReachedLikeLimit: true,
  subscriptionTier: 'raiz-basic'
});
```

## Code Structure

```
src/
├── config/
│   ├── subscription-tiers.js      # Tier definitions and features
│   └── in-app-purchases.js        # IAP packages and pricing
├── models/
│   ├── User.js                    # User model with usage tracking
│   └── Subscription.js            # Subscription model with features
├── features/
│   ├── LikeManager.js             # Like functionality with limits
│   └── PurchaseManager.js         # In-app purchase handling
├── paywalls/
│   ├── OnboardingPaywall.js       # First-time user paywall
│   ├── LimitReachedPaywall.js     # Limit/feature paywalls
│   ├── GridUpsell.js              # In-grid promotional cards
│   ├── PostMatchUpsell.js         # Post-match upsells
│   └── SettingsUpgrade.js         # Settings page upgrades
└── index.js                       # Main export file
```

## Usage Examples

### Creating a User

```javascript
const { User, Subscription } = require('./src');
const { SUBSCRIPTION_TIERS } = require('./src/config/subscription-tiers');

// Create a new user with Basic tier
const user = new User('user123', 'John Doe', 'john@example.com');

// Upgrade to Plus
user.subscription.upgradeTo(SUBSCRIPTION_TIERS.PLUS, 'monthly');
```

### Processing Likes

```javascript
const { LikeManager } = require('./src/features/LikeManager');

// Check if user can like
const canLike = user.canLike();

// Process a like
const result = LikeManager.processLike(user, 'targetUser456');

if (!result.success) {
  // Show paywall
  const paywall = LimitReachedPaywall.getDailyLikeLimitPaywall();
  // Display paywall to user
}

// Get like status
const status = LikeManager.getLikeStatus(user);
console.log(`Remaining likes: ${status.remaining}`);
```

### Handling In-App Purchases

```javascript
const { PurchaseManager } = require('./src/features/PurchaseManager');

// Get boost purchase modal
const boostModal = PurchaseManager.getBoostPurchaseModal();

// Process purchase
const purchase = PurchaseManager.processPurchase(user, 'boost-5', 'stripe');

// After payment confirmation
const completed = PurchaseManager.completePurchase(user, 'boost-5', 'txn_123');

// Use a boost
user.useBoost();
```

### Using Active Effects

```javascript
// Use a boost (30 minutes)
if (user.useBoost()) {
  console.log('Boost activated!');
}

// Use a highlight (24 hours)
if (user.useHighlight()) {
  console.log('Highlight activated!');
}

// Check active effects
if (user.hasActiveBoost()) {
  console.log('Boost is currently active');
}

// Toggle incognito mode (Flame only)
if (user.toggleIncognitoMode()) {
  console.log('Incognito mode enabled');
}

// Set travel location (Flame only)
if (user.setTravelLocation('New York, NY')) {
  console.log('Travel mode activated');
}
```

### Checking Features

```javascript
// Check if user has specific features
if (user.subscription.canSeeWhoLikedYou()) {
  // Show "liked you" section
}

if (user.subscription.hasAdvancedFilters()) {
  // Enable advanced filter UI
}

if (user.subscription.hasIncognitoMode()) {
  // Show incognito toggle
}

// Get user summary
const summary = user.getSummary();
console.log(summary);
```

## Integration with Stripe

For production implementation, integrate with Stripe for payment processing:

1. **Subscription Setup:**
   - Create Stripe Products for each tier
   - Create Prices for each billing period
   - Use Stripe Checkout or Stripe Elements

2. **In-App Purchases:**
   - Create Products for each IAP package
   - Handle one-time payments
   - Store transaction IDs

3. **Webhook Handling:**
   - Listen for `checkout.session.completed`
   - Listen for `invoice.payment_succeeded`
   - Update user subscription status

## Testing Checklist

- [ ] User can sign up with Basic tier
- [ ] User sees onboarding paywall
- [ ] Like limit enforced for Basic tier
- [ ] Paywall shown when limit reached
- [ ] User can upgrade to Plus
- [ ] Plus features enabled after upgrade
- [ ] User can upgrade to Flame
- [ ] Flame features enabled after upgrade
- [ ] Boosts can be purchased and used
- [ ] Highlights can be purchased and used
- [ ] Super Likes can be purchased and used
- [ ] Active effects expire correctly
- [ ] Grid upsells shown appropriately
- [ ] Post-match upsells triggered correctly
- [ ] Settings upgrade UI displays correctly
- [ ] Purchase restoration works

## Next Steps

1. **Database Integration:** Connect to your database to persist user data, subscriptions, and purchases
2. **Payment Processing:** Implement Stripe API integration for actual payments
3. **UI Components:** Build React/React Native components for paywalls and upgrade flows
4. **Analytics:** Add tracking for conversion funnels and user behavior
5. **A/B Testing:** Test different paywall messaging and pricing
6. **Platform Integration:** Integrate with iOS App Store and Google Play billing
7. **Compliance:** Ensure GDPR, CCPA, and app store guidelines compliance

## Support

For questions or issues with implementation, refer to:
- Stripe Documentation: https://stripe.com/docs
- iOS In-App Purchase: https://developer.apple.com/in-app-purchase/
- Google Play Billing: https://developer.android.com/google/play/billing
