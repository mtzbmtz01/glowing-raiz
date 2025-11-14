# Raiz Dating App - Project Structure

## Directory Overview

```
glowing-raiz/
├── .gitignore                          # Git ignore rules
├── package.json                        # NPM package configuration
├── README.md                           # Project overview
├── IMPLEMENTATION.md                   # Complete technical documentation
├── QUICK_START.md                      # Developer quick reference
├── SUBSCRIPTION_FLOW.md                # User journey & monetization strategy
├── PROJECT_STRUCTURE.md                # This file
│
├── src/                                # Source code
│   ├── index.js                        # Main entry point & exports
│   │
│   ├── config/                         # Configuration files
│   │   ├── subscription-tiers.js       # Tier definitions, pricing, features
│   │   └── in-app-purchases.js         # IAP packages (Boosts, Highlights, etc.)
│   │
│   ├── models/                         # Data models
│   │   ├── User.js                     # User model with usage tracking
│   │   └── Subscription.js             # Subscription tier management
│   │
│   ├── features/                       # Feature implementations
│   │   ├── LikeManager.js              # Like processing with limits
│   │   └── PurchaseManager.js          # In-app purchase handling
│   │
│   └── paywalls/                       # Paywall components
│       ├── OnboardingPaywall.js        # First-time user paywall
│       ├── LimitReachedPaywall.js      # Limit & feature lock paywalls
│       ├── GridUpsell.js               # In-grid promotional cards
│       ├── PostMatchUpsell.js          # Post-match upsells
│       └── SettingsUpgrade.js          # Settings upgrade UI
│
└── examples/                           # Example code
    └── usage-example.js                # Working demonstration
```

## File Descriptions

### Configuration Files

#### `.gitignore`
- Excludes node_modules, build artifacts, and environment files from Git

#### `package.json`
- NPM package configuration
- Defines project metadata and scripts
- No external dependencies (vanilla JavaScript)

### Documentation Files

#### `README.md`
- Project overview
- Quick start instructions
- Basic usage examples
- Links to detailed documentation

#### `IMPLEMENTATION.md` (10,000+ words)
- Complete technical documentation
- Feature specifications for all tiers
- Detailed usage examples
- Integration guides for Stripe, iOS, Android
- Testing checklist
- API reference

#### `QUICK_START.md`
- Developer quick reference
- Common code snippets
- Feature checks
- Pricing structure
- Next steps for integration

#### `SUBSCRIPTION_FLOW.md`
- Visual user journey diagrams
- Monetization strategy
- Conversion funnels
- Timing & frequency guidelines
- Key metrics to track
- Best practices

### Source Code Files

#### `src/index.js` (Main Entry Point)
Exports all modules for easy importing:
```javascript
const { User, Subscription, LikeManager, ... } = require('./src');
```

#### `src/config/subscription-tiers.js` (2,600 chars)
**Purpose**: Define subscription tier constants, pricing, and features

**Exports**:
- `SUBSCRIPTION_TIERS` - Tier IDs (BASIC, PLUS, FLAME)
- `TIER_NAMES` - Human-readable names
- `TIER_TAGLINES` - Marketing taglines
- `TIER_PRICING` - Pricing structure (monthly, 3mo, 6mo)
- `TIER_FEATURES` - Complete feature matrix

**Key Features Defined**:
- Likes per day limits
- Boost/Highlight frequencies
- Feature availability (filters, rewind, incognito, etc.)
- Grid priority levels
- Chat access levels

#### `src/config/in-app-purchases.js` (2,100 chars)
**Purpose**: Define in-app purchase packages and pricing

**Exports**:
- `PURCHASE_TYPES` - Type constants (BOOST, HIGHLIGHT, SUPER_LIKE)
- `BOOST_PACKAGES` - 3 packages ($4.99, $19.99, $34.99)
- `HIGHLIGHT_PACKAGES` - 2 packages ($3.99, $14.99)
- `SUPER_LIKE_PACKAGES` - 2 packages ($4.99, $14.99)
- `ALL_PURCHASES` - Combined object of all packages

**Package Details**:
- Quantity, price, description
- Duration (30 min for boosts, 24 hrs for highlights)

#### `src/models/Subscription.js` (4,800 chars)
**Purpose**: Manage subscription tiers and feature access

**Class**: `Subscription`

**Key Methods**:
- `getTierName()` - Get human-readable tier name
- `getFeatures()` - Get all features for tier
- `hasFeature(name)` - Check specific feature availability
- `hasUnlimitedLikes()` - Check for unlimited likes
- `canSeeWhoLikedYou()` - Check visibility of likes
- `hasAdvancedFilters()` - Check filter access
- `canRewind()` - Check rewind capability
- `hasIncognitoMode()` - Check incognito access
- `hasTravelMode()` - Check travel mode access
- `upgradeTo(tier)` - Upgrade to new tier
- `isActive()` - Check if subscription is active
- `getSummary()` - Get complete subscription info

#### `src/models/User.js` (5,600 chars)
**Purpose**: User model with usage tracking and inventory

**Class**: `User`

**Properties**:
- `subscription` - Subscription object
- `dailyUsage` - Tracks likes and rewinds used
- `inventory` - Stores purchased items (boosts, highlights, super likes)
- `activeEffects` - Tracks active boosts, highlights, modes

**Key Methods**:
- `canLike()` - Check if user can like
- `recordLike()` - Record a like action
- `getRemainingLikes()` - Get remaining likes for today
- `canRewind()` - Check if user can rewind
- `recordRewind()` - Record a rewind action
- `addToInventory()` - Add purchased items
- `useBoost()` - Activate a boost (30 min)
- `useHighlight()` - Activate a highlight (24 hrs)
- `useSuperLike()` - Use a super like
- `toggleIncognitoMode()` - Toggle incognito (Flame only)
- `setTravelLocation()` - Set travel mode (Flame only)
- `getSummary()` - Get complete user info

#### `src/features/LikeManager.js` (4,400 chars)
**Purpose**: Handle like functionality with tier-based limits

**Class**: `LikeManager` (static methods)

**Key Methods**:
- `processLike(user, targetId, isSuperLike)` - Process a like action
- `getLikeStatus(user)` - Get current like status
- `getLikeLimitWarning(user)` - Get warning if near limit
- `getMatchProbabilityMultiplier(user)` - Calculate visibility boost
- `getVisibilityStatus(user)` - Get current visibility info

**Features**:
- Enforces daily like limits
- Returns appropriate error messages
- Calculates visibility multipliers (Boost: 10x, Highlight: 3x, Priority: 2-5x)
- Suggests upgrade when appropriate

#### `src/features/PurchaseManager.js` (6,300 chars)
**Purpose**: Handle in-app purchases and Stripe integration

**Class**: `PurchaseManager` (static methods)

**Key Methods**:
- `processPurchase(user, packageId, method)` - Initiate purchase
- `completePurchase(user, packageId, txnId)` - Complete after payment
- `getBoostPurchaseModal()` - Get boost purchase UI data
- `getHighlightPurchaseModal()` - Get highlight purchase UI data
- `getSuperLikePurchaseModal()` - Get super like purchase UI data
- `calculateSavings(pkg1, pkg2)` - Calculate savings percentage
- `restorePurchases(userId, platform)` - Restore previous purchases

**Features**:
- Modal content with packages and benefits
- Savings calculations
- Stripe checkout URL generation (mock)
- Purchase history tracking

#### `src/paywalls/OnboardingPaywall.js` (4,300 chars)
**Purpose**: First paywall shown to new users

**Class**: `OnboardingPaywall` (static methods)

**Key Methods**:
- `getPaywallContent()` - Get complete onboarding paywall
- `formatFeatures(tier)` - Format features for display
- `getBillingPeriods(tier)` - Get billing options with savings

**Content**:
- Three-column tier comparison
- Pre-selected tier (Plus)
- Feature lists per tier
- Pricing with savings calculations
- Primary/secondary CTAs

#### `src/paywalls/LimitReachedPaywall.js` (5,100 chars)
**Purpose**: Paywalls shown when limits hit or features locked

**Class**: `LimitReachedPaywall` (static methods)

**Paywall Types**:
- `getDailyLikeLimitPaywall()` - Like limit reached
- `getSeeWhoLikedYouPaywall(count)` - See likes locked
- `getAdvancedFiltersPaywall()` - Filters locked
- `getRewindLockedPaywall()` - Rewind locked
- `getIncognitoModePaywall()` - Incognito locked (Flame)
- `getTravelModePaywall()` - Travel mode locked (Flame)
- `getReadReceiptsPaywall()` - Read receipts locked
- `getPaywall(type, metadata)` - Get any paywall by type

**Features**:
- Context-specific messaging
- Feature highlights
- Appropriate upgrade CTAs
- Visual hints (e.g., blurred faces)

#### `src/paywalls/GridUpsell.js` (3,800 chars)
**Purpose**: Promotional cards shown in profile grid

**Class**: `GridUpsell` (static methods)

**Card Types**:
- `getBoostUpsellCard()` - Boost promotion
- `getHighlightUpsellCard()` - Highlight promotion
- `getPlusUpgradeCard()` - Plus tier promotion
- `getFlameUpgradeCard()` - Flame tier promotion
- `getRandomUpsellCard(tier, profilesSeen)` - Get contextual card
- `shouldShowUpsell(profilesSeen, lastUpsellAt)` - Timing logic

**Features**:
- Frequency control (every 20-30 profiles)
- Tier-aware (don't show Plus to Plus users)
- Minimum spacing between upsells

#### `src/paywalls/PostMatchUpsell.js` (3,900 chars)
**Purpose**: Upsells shown after getting a match

**Class**: `PostMatchUpsell` (static methods)

**Key Methods**:
- `getPostMatchUpsell(userContext)` - Get context-aware upsell
- `shouldShowUpsell(matchCount, lastUpsellMatch)` - Timing logic
- `getUpsellTiming(userEngagement)` - Frequency based on engagement

**Upsell Types**:
- At like limit: Encourage upgrade to Plus
- No active boost: Promote boost purchase
- Milestones (5, 10, 15 matches): Celebrate + upsell
- Default: Subtle banner

**Features**:
- Context-aware messaging
- Variable timing (immediate, delayed, banner)
- Engagement-based frequency

#### `src/paywalls/SettingsUpgrade.js` (6,900 chars)
**Purpose**: Upgrade UI in settings/profile screens

**Class**: `SettingsUpgrade` (static methods)

**Key Methods**:
- `getUpgradeBanner(currentTier)` - Get upgrade banner
- `getSubscriptionOptions(currentTier)` - Get management options
- `getComparisonTable()` - Get full feature comparison
- `getQuickActions(tier, inventory)` - Get contextual quick actions

**Features**:
- Prominent upgrade banner
- Complete feature comparison table
- Subscription management options
- Quick purchase actions
- "Restore Purchases" support

### Example Files

#### `examples/usage-example.js` (6,000 chars)
**Purpose**: Demonstrate complete system functionality

**Demonstrates**:
1. Creating a user with Basic tier
2. Onboarding paywall content
3. Processing likes until limit
4. Limit paywall triggering
5. Upgrading to Plus tier
6. Purchasing and using boosts
7. Visibility status calculation
8. Grid upsell cards
9. Post-match upsells
10. Settings upgrade UI
11. Complete user summary

**How to Run**:
```bash
node examples/usage-example.js
```

## Data Flow

### 1. User Creation Flow
```
User created → Assigned Basic tier → Daily usage initialized
```

### 2. Like Processing Flow
```
User likes profile → Check canLike() → Record like → Update remaining
                        ↓ (if false)
                   Show paywall
```

### 3. Upgrade Flow
```
User clicks upgrade → Select tier & period → Process payment → Update subscription → Unlock features
```

### 4. Purchase Flow
```
User clicks IAP → Show modal → Select package → Process payment → Add to inventory → User can use items
```

### 5. Active Effects Flow
```
User uses item → Activate effect → Set expiry time → Check periodically → Auto-expire
```

## Integration Points

### Frontend Integration
```javascript
// Import everything
const Raiz = require('./src');

// Create user
const user = new Raiz.User(userId, name, email);

// Show paywall
const paywall = Raiz.OnboardingPaywall.getPaywallContent();

// Process actions
const result = Raiz.LikeManager.processLike(user, targetId);
```

### Backend Integration
- Store user subscription in database
- Track daily usage (reset at midnight)
- Store inventory and active effects
- Handle Stripe webhooks for payments
- Sync with iOS/Android billing

### Payment Integration
- Stripe for web/subscriptions
- Apple In-App Purchase for iOS
- Google Play Billing for Android

## Key Constants Reference

### Subscription Tiers
```javascript
SUBSCRIPTION_TIERS.BASIC  // 'raiz-basic'
SUBSCRIPTION_TIERS.PLUS   // 'raiz-plus'
SUBSCRIPTION_TIERS.FLAME  // 'raiz-flame'
```

### Purchase Types
```javascript
PURCHASE_TYPES.BOOST       // 'boost'
PURCHASE_TYPES.HIGHLIGHT   // 'highlight'
PURCHASE_TYPES.SUPER_LIKE  // 'super-like'
```

### Pricing
- Basic: Free
- Plus: $14.99/mo, $39.99/3mo, $69.99/6mo
- Flame: $29.99/mo, $79.99/3mo, $139.99/6mo

### Limits
- Basic: 25 likes/day
- Plus/Flame: Unlimited likes

## Testing Checklist

- [x] User creation works
- [x] Like limits enforced
- [x] Paywalls trigger correctly
- [x] Upgrades work properly
- [x] Features unlock after upgrade
- [x] IAP flow works
- [x] Active effects expire correctly
- [x] Daily reset works
- [x] Inventory tracking works
- [x] Visibility calculations correct
- [x] Example script runs successfully
- [x] No security vulnerabilities (CodeQL)

## Next Steps for Integration

1. **Database Schema**: Design tables for users, subscriptions, purchases, usage
2. **API Endpoints**: Create REST/GraphQL APIs for all operations
3. **Payment Processing**: Integrate Stripe, Apple, Google billing
4. **Frontend Components**: Build React/React Native UI components
5. **Analytics**: Add tracking for conversions, revenue, engagement
6. **Testing**: Add unit tests, integration tests, E2E tests
7. **Deployment**: Set up CI/CD, staging, production environments

## Support & Documentation

- **Technical Details**: See IMPLEMENTATION.md
- **Quick Reference**: See QUICK_START.md
- **Strategy**: See SUBSCRIPTION_FLOW.md
- **Code Examples**: See examples/usage-example.js

## License

ISC
