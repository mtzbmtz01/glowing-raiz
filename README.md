# Raiz Dating App

A modern dating app with a comprehensive three-tier subscription system and in-app purchases.

## Features

### Subscription Tiers

1. **Raiz Basic** (Free) - "Get rooted, start meeting"
   - 25 likes per day
   - Core grid access
   - Chat with mutuals only

2. **Raiz Plus** ($14.99/mo) - "Be seen first"
   - Unlimited likes
   - See who liked you
   - Weekly boosts
   - Advanced filters
   - Read receipts
   - Rewind last skip

3. **Raiz Flame** ($29.99/mo) - "Own the grid"
   - Everything in Plus
   - Daily boosts
   - Always top priority
   - Incognito mode
   - Travel mode
   - Unlimited rewinds

### In-App Purchases

- **Boosts** ($4.99 - $34.99): Top of local grid for 30 minutes
- **Highlights** ($3.99 - $14.99): Colored border + glow for 24 hours
- **Super Likes** ($4.99 - $14.99): Stand out with big animation

## Quick Start

```javascript
const { User, LikeManager, PurchaseManager } = require('./src');

// Create a user
const user = new User('user123', 'John Doe', 'john@example.com');

// Process a like
const likeResult = LikeManager.processLike(user, 'targetUser456');

// Purchase a boost
const boostModal = PurchaseManager.getBoostPurchaseModal();
```

## Documentation

See [IMPLEMENTATION.md](./IMPLEMENTATION.md) for complete implementation details, usage examples, and integration guides.

## Project Structure

```
src/
├── config/           # Tier and pricing configuration
├── models/           # User and Subscription models
├── features/         # Like and Purchase managers
├── paywalls/         # Paywall and upsell components
└── index.js          # Main exports
```

## Testing

```bash
npm test
```

## License

ISC 
