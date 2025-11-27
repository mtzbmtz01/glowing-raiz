# Monetization Features - Quick Reference

## Overview
The Glowing Raiz dating app now includes three premium monetization features designed to enhance user experience and generate revenue.

---

## 1. Premium Boosts 🚀

### What it does
Temporarily increases your profile visibility to get more matches.

### Pricing
- **$1.00 per 10 minutes**
- Minimum: 10 minutes ($1.00)
- Maximum: 180 minutes ($18.00)

### How it works
- Purchase a boost for a specified duration
- Your profile appears more frequently to other users
- Boost expires automatically after the duration
- Users can purchase multiple boosts

### Example Usage
```bash
# Purchase a 30-minute boost ($3.00)
curl -X POST http://localhost:3000/api/monetization/boost \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-id", "durationMinutes": 30}'
```

### Benefits
- Immediate visibility increase
- Flexible duration options
- Pay-per-use model
- No commitment required

---

## 2. Unlimited Likes 💎

### What it does
Premium subscription removes daily like limits.

### User Tiers
- **Free Users**: 10 likes per 24 hours
- **Premium Users**: Unlimited likes

### Pricing
- **Monthly Plan**: $9.99/month
- **Yearly Plan**: $99.99/year (save 17%)

### How it works
- Free users start with 10 likes per day
- Likes reset after 24 hours for free users
- Premium users never run out of likes
- Subscription can be cancelled anytime

### Example Usage
```bash
# Upgrade to Premium (monthly)
curl -X POST http://localhost:3000/api/monetization/premium \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-id", "plan": "monthly"}'

# Record a like
curl -X POST http://localhost:3000/api/users/user-id/like
```

### Benefits
- No daily limits
- Like as many profiles as you want
- Continuous subscription
- Better value with yearly plan

---

## 3. Profile Highlights ⭐

### What it does
Features your profile prominently to stand out from the crowd.

### Pricing
- **$2.00 per 24 hours**
- Minimum: 1 hour ($0.08)
- Maximum: 168 hours / 1 week ($14.00)

### How it works
- Purchase a highlight for a specified duration
- Your profile is featured prominently
- Highlight expires automatically after the duration
- Users can purchase multiple highlights

### Example Usage
```bash
# Purchase a 24-hour highlight ($2.00)
curl -X POST http://localhost:3000/api/monetization/highlight \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-id", "durationHours": 24}'
```

### Benefits
- Premium placement in listings
- Increased profile views
- Flexible duration options
- Pay-per-use model

---

## Feature Comparison

| Feature | Free Users | Premium Users |
|---------|------------|---------------|
| Likes per day | 10 | Unlimited |
| Profile Boosts | Pay per use | Pay per use |
| Profile Highlights | Pay per use | Pay per use |
| Monthly Cost | $0 | $9.99 |

---

## Combined Power User Example

A power user might use all features together:

```bash
# 1. Upgrade to Premium for unlimited likes
curl -X POST http://localhost:3000/api/monetization/premium \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-id", "plan": "monthly"}'

# 2. Purchase a 60-minute boost during peak hours
curl -X POST http://localhost:3000/api/monetization/boost \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-id", "durationMinutes": 60}'

# 3. Add a 48-hour profile highlight for the weekend
curl -X POST http://localhost:3000/api/monetization/highlight \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-id", "durationHours": 48}'

# 4. Check overall status
curl http://localhost:3000/api/monetization/status/user-id
```

**Total Investment**: $9.99 (monthly) + $6.00 (boost) + $4.00 (highlight) = $19.99

---

## Revenue Projections

### Example Scenarios

**Conservative (1000 users)**
- 10% Premium subscribers: 100 × $9.99 = $999/month
- 5% buy boosts monthly: 50 × $3.00 = $150/month
- 5% buy highlights monthly: 50 × $2.00 = $100/month
- **Total**: ~$1,249/month

**Moderate (10,000 users)**
- 15% Premium subscribers: 1,500 × $9.99 = $14,985/month
- 10% buy boosts monthly: 1,000 × $3.00 = $3,000/month
- 8% buy highlights monthly: 800 × $2.00 = $1,600/month
- **Total**: ~$19,585/month

**Optimistic (50,000 users)**
- 20% Premium subscribers: 10,000 × $9.99 = $99,900/month
- 15% buy boosts monthly: 7,500 × $3.00 = $22,500/month
- 12% buy highlights monthly: 6,000 × $2.00 = $12,000/month
- **Total**: ~$134,400/month

---

## Technical Implementation

### Models
- `User`: Manages user accounts and like limits
- `Boost`: Temporary profile visibility increases
- `ProfileHighlight`: Featured profile placements
- `PremiumSubscription`: Premium tier management

### APIs
- `/api/users`: User management
- `/api/monetization/boost`: Boost management
- `/api/monetization/highlight`: Highlight management
- `/api/monetization/premium`: Premium subscription

### Data Storage
Currently using in-memory storage (Map objects). Ready for database integration with:
- PostgreSQL
- MongoDB
- MySQL
- Any other database system

---

## Next Steps for Production

1. **Payment Integration**
   - Integrate Stripe/PayPal for actual payments
   - Add payment webhooks
   - Implement refund logic

2. **Database Integration**
   - Replace Map storage with database
   - Add data persistence
   - Implement caching layer

3. **Analytics**
   - Track feature usage
   - Monitor revenue metrics
   - A/B testing for pricing

4. **Push Notifications**
   - Notify when boost is active
   - Alert when highlight expires
   - Premium renewal reminders

5. **Admin Dashboard**
   - View revenue metrics
   - Manage user subscriptions
   - Adjust pricing dynamically
