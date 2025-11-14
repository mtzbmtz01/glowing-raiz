# Glowing Raiz Dating App

A modern dating app with comprehensive monetization features.

## Features

### 🚀 Premium Boosts
Increase your profile visibility for a limited time to get more matches!
- Flexible duration (10-180 minutes)
- $1.00 per 10 minutes
- Instant activation
- Multiple boosts available

### 💎 Premium Subscription (Unlimited Likes)
Upgrade to Premium and never worry about like limits again!
- **Free Users**: 10 likes per 24 hours
- **Premium Users**: Unlimited likes
- Monthly plan: $9.99/month
- Yearly plan: $99.99/year (save 17%)

### ⭐ Profile Highlights
Feature your profile prominently to stand out from the crowd!
- Flexible duration (1-168 hours)
- $2.00 per 24 hours
- Enhanced visibility
- Premium placement

## Installation

```bash
# Clone the repository
git clone https://github.com/mtzbmtz01/glowing-raiz.git
cd glowing-raiz

# Install dependencies
npm install

# Start the server
npm start
```

The server will start on http://localhost:3000

## Usage

### Starting the Server

```bash
npm start
```

### Running Tests

```bash
npm test
```

## API Examples

### Create a User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "email": "john@example.com"}'
```

### Purchase a Premium Boost

```bash
curl -X POST http://localhost:3000/api/monetization/boost \
  -H "Content-Type: application/json" \
  -d '{"userId": "your-user-id", "durationMinutes": 30}'
```

### Upgrade to Premium (Unlimited Likes)

```bash
curl -X POST http://localhost:3000/api/monetization/premium \
  -H "Content-Type: application/json" \
  -d '{"userId": "your-user-id", "plan": "monthly"}'
```

### Purchase a Profile Highlight

```bash
curl -X POST http://localhost:3000/api/monetization/highlight \
  -H "Content-Type: application/json" \
  -d '{"userId": "your-user-id", "durationHours": 24}'
```

### Record a Like

```bash
curl -X POST http://localhost:3000/api/users/your-user-id/like
```

### Check Monetization Status

```bash
curl http://localhost:3000/api/monetization/status/your-user-id
```

## Documentation

For detailed API documentation, see [API.md](API.md)

## Project Structure

```
glowing-raiz/
├── src/
│   ├── models/           # Data models
│   │   ├── User.js
│   │   ├── Boost.js
│   │   ├── ProfileHighlight.js
│   │   └── PremiumSubscription.js
│   ├── services/         # Business logic
│   │   ├── UserService.js
│   │   └── MonetizationService.js
│   ├── routes/           # API routes
│   │   ├── users.js
│   │   └── monetization.js
│   ├── app.js            # Express app configuration
│   └── server.js         # Server entry point
├── tests/                # Test suite
│   └── run-tests.js
├── API.md               # API documentation
├── README.md            # This file
└── package.json         # Project dependencies

```

## Testing

The project includes comprehensive tests covering:
- User model and like limits
- Premium boost functionality
- Profile highlight functionality
- Premium subscription (unlimited likes)
- Service layer integration
- End-to-end user journeys

All tests must pass before deployment.

## Architecture

### Models
- **User**: User accounts with premium status and like limits
- **Boost**: Temporary profile visibility boosts
- **ProfileHighlight**: Featured profile placements
- **PremiumSubscription**: Premium subscription management

### Services
- **UserService**: User management and like tracking
- **MonetizationService**: All monetization features (boosts, highlights, premium)

### Routes
- **/api/users**: User management endpoints
- **/api/monetization**: Monetization feature endpoints

## Technology Stack

- **Node.js**: Runtime environment
- **Express**: Web framework
- **UUID**: Unique identifier generation

## License

ISC 
