# Glowing Raiz Dating App - API Documentation

## Overview

This API provides monetization features for the Glowing Raiz dating app, including:

1. **Premium Boosts** - Increase profile visibility for a limited time
2. **Unlimited Likes** - Premium subscription removes daily like limits
3. **Profile Highlights** - Feature your profile prominently

## Base URL

```
http://localhost:3000/api
```

## Endpoints

### User Management

#### Create a User

```
POST /users
```

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "id": "uuid",
  "username": "john_doe",
  "email": "john@example.com",
  "premiumTier": "free",
  "likesRemaining": 10,
  "lastLikesReset": "2025-11-14T04:00:00.000Z",
  "boosts": [],
  "profileHighlights": [],
  "createdAt": "2025-11-14T04:00:00.000Z"
}
```

#### Get User Profile

```
GET /users/:userId
```

**Response:**
```json
{
  "id": "uuid",
  "username": "john_doe",
  "email": "john@example.com",
  "premiumTier": "free",
  "likesRemaining": 10,
  "monetization": {
    "premium": {
      "isPremium": false,
      "hasUnlimitedLikes": false
    },
    "activeBoosts": 0,
    "activeHighlights": 0,
    "boosts": [],
    "highlights": []
  }
}
```

#### Record a Like

```
POST /users/:userId/like
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Like recorded",
  "likesRemaining": 9
}
```

**Response (Limit Reached):**
```json
{
  "success": false,
  "message": "Daily like limit reached. Upgrade to Premium for unlimited likes!",
  "likesRemaining": 0
}
```

### Premium Boosts

#### Purchase a Boost

```
POST /monetization/boost
```

**Request Body:**
```json
{
  "userId": "uuid",
  "durationMinutes": 30
}
```

**Pricing:**
- $1.00 per 10 minutes
- Minimum: 10 minutes ($1.00)
- Maximum: 180 minutes ($18.00)

**Response:**
```json
{
  "success": true,
  "boost": {
    "id": "uuid",
    "userId": "uuid",
    "active": true,
    "durationMinutes": 30,
    "createdAt": "2025-11-14T04:00:00.000Z",
    "expiresAt": "2025-11-14T04:30:00.000Z",
    "price": 3.00
  },
  "message": "Boost purchased for 30 minutes at $3.00"
}
```

#### Get Active Boosts

```
GET /monetization/boost/:userId
```

**Response:**
```json
{
  "userId": "uuid",
  "activeBoosts": 1,
  "boosts": [
    {
      "id": "uuid",
      "userId": "uuid",
      "active": true,
      "durationMinutes": 30,
      "createdAt": "2025-11-14T04:00:00.000Z",
      "expiresAt": "2025-11-14T04:30:00.000Z",
      "price": 3.00
    }
  ]
}
```

### Profile Highlights

#### Purchase a Highlight

```
POST /monetization/highlight
```

**Request Body:**
```json
{
  "userId": "uuid",
  "durationHours": 24
}
```

**Pricing:**
- $2.00 per 24 hours
- Minimum: 1 hour ($0.08)
- Maximum: 168 hours / 1 week ($14.00)

**Response:**
```json
{
  "success": true,
  "highlight": {
    "id": "uuid",
    "userId": "uuid",
    "active": true,
    "durationHours": 24,
    "createdAt": "2025-11-14T04:00:00.000Z",
    "expiresAt": "2025-11-15T04:00:00.000Z",
    "price": 2.00
  },
  "message": "Profile highlight purchased for 24 hours at $2.00"
}
```

#### Get Active Highlights

```
GET /monetization/highlight/:userId
```

**Response:**
```json
{
  "userId": "uuid",
  "activeHighlights": 1,
  "highlights": [
    {
      "id": "uuid",
      "userId": "uuid",
      "active": true,
      "durationHours": 24,
      "createdAt": "2025-11-14T04:00:00.000Z",
      "expiresAt": "2025-11-15T04:00:00.000Z",
      "price": 2.00
    }
  ]
}
```

### Premium Subscription (Unlimited Likes)

#### Purchase Premium

```
POST /monetization/premium
```

**Request Body:**
```json
{
  "userId": "uuid",
  "plan": "monthly"
}
```

**Plans:**
- `monthly`: $9.99/month
- `yearly`: $99.99/year

**Response:**
```json
{
  "success": true,
  "subscription": {
    "id": "uuid",
    "userId": "uuid",
    "plan": "monthly",
    "active": true,
    "startDate": "2025-11-14T04:00:00.000Z",
    "endDate": "2025-12-14T04:00:00.000Z",
    "price": 9.99
  },
  "message": "Premium monthly subscription activated at $9.99"
}
```

#### Get Premium Status

```
GET /monetization/premium/:userId
```

**Response:**
```json
{
  "userId": "uuid",
  "isPremium": true,
  "hasUnlimitedLikes": true,
  "subscription": {
    "id": "uuid",
    "userId": "uuid",
    "plan": "monthly",
    "active": true,
    "startDate": "2025-11-14T04:00:00.000Z",
    "endDate": "2025-12-14T04:00:00.000Z",
    "price": 9.99
  }
}
```

#### Cancel Premium

```
DELETE /monetization/premium/:userId
```

**Response:**
```json
{
  "success": true,
  "message": "Premium subscription cancelled"
}
```

### Monetization Status

#### Get Overall Status

```
GET /monetization/status/:userId
```

**Response:**
```json
{
  "userId": "uuid",
  "premium": {
    "isPremium": true,
    "hasUnlimitedLikes": true,
    "subscription": {
      "id": "uuid",
      "userId": "uuid",
      "plan": "monthly",
      "active": true,
      "startDate": "2025-11-14T04:00:00.000Z",
      "endDate": "2025-12-14T04:00:00.000Z",
      "price": 9.99
    }
  },
  "activeBoosts": 1,
  "activeHighlights": 1,
  "boosts": [...],
  "highlights": [...]
}
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (invalid parameters)
- `403` - Forbidden (e.g., like limit reached)
- `404` - Not Found
- `500` - Internal Server Error

## Features Summary

### 1. Premium Boosts
- Temporarily increases profile visibility
- Flexible duration (10-180 minutes)
- Pay-per-use pricing
- Can purchase multiple boosts

### 2. Unlimited Likes
- Premium subscription removes daily like limits
- Free users: 10 likes per 24 hours
- Premium users: Unlimited likes
- Monthly and yearly subscription options

### 3. Profile Highlights
- Featured profile placement
- Flexible duration (1-168 hours)
- Pay-per-use pricing
- Can purchase multiple highlights
