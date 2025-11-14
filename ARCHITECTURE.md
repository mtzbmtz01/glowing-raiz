# Architecture Overview

## System Architecture

Raiz is a full-stack dating application with a clear separation between frontend (mobile) and backend services.

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile App (React Native)                │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Screens    │  │  Navigation  │  │   Components     │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Services Layer                           │   │
│  │  - API Client (Axios)                                 │   │
│  │  - Socket.IO Client                                   │   │
│  │  - Location Services                                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTP/REST & WebSocket
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Backend API (Node.js)                     │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Routes     │  │ Controllers  │  │   Services       │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Middleware Layer                         │   │
│  │  - Authentication (JWT)                               │   │
│  │  - CORS                                               │   │
│  │  - Error Handling                                     │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Real-time Layer                          │   │
│  │  - Socket.IO Server                                   │   │
│  │  - Connection Management                              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                         Prisma ORM
                            │
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐   │
│  │   User   │  │ Profile  │  │ Message  │  │Block/Report│   │
│  └──────────┘  └──────────┘  └──────────┘  └───────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Key Components

### Mobile App (Frontend)

**Technology Stack:**
- React Native with Expo
- TypeScript
- React Navigation
- Socket.IO Client
- AsyncStorage

**Key Features:**
- Cross-platform (iOS & Android)
- GPS location tracking
- Real-time messaging
- Offline-first with local storage
- Push notifications (to be implemented)

**Screen Flow:**
1. Auth Stack (Login/Register)
2. Main Tabs (Home/Chats/Profile)
3. Modal Screens (Chat, User Profile, Edit Profile)

### Backend API

**Technology Stack:**
- Node.js & Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Socket.IO
- JWT for authentication

**Architecture Pattern:**
- **Routes** - Define API endpoints
- **Controllers** - Handle HTTP requests/responses
- **Services** - Business logic and data operations
- **Middleware** - Cross-cutting concerns (auth, validation)

**Key Features:**
- RESTful API design
- JWT-based authentication
- Real-time messaging via WebSocket
- GPS-based user discovery
- Block/report functionality

### Database Schema

**Core Models:**

1. **User**
   - Authentication data
   - Account metadata
   - Relations to Profile, Messages, Blocks, Reports

2. **Profile**
   - User information (name, bio, photos)
   - Location data (latitude, longitude)
   - Preferences (age range, distance, interested in)
   - Activity status

3. **Message**
   - Chat messages
   - Read status
   - Timestamps
   - Sender/Receiver relations

4. **Block**
   - User blocking relationships
   - Prevent interactions

5. **Report**
   - User reports
   - Reason and details
   - Status tracking

## Authentication Flow

```
Mobile App                Backend                  Database
    │                        │                         │
    ├─── Register/Login ────>│                         │
    │                        ├──── Create/Verify ─────>│
    │                        │<──── User Data ─────────┤
    │<──── JWT Token ────────┤                         │
    │                        │                         │
    ├─── API Request ───────>│                         │
    │    (with JWT)          ├──── Validate Token      │
    │                        ├──── Query Data ────────>│
    │                        │<──── Results ───────────┤
    │<──── Response ─────────┤                         │
```

## Real-time Messaging Flow

```
User A (Mobile)          Socket.IO Server         User B (Mobile)
     │                         │                         │
     ├──── Connect ───────────>│                         │
     │    (with JWT)            │<──── Connect ──────────┤
     │                          │                         │
     ├──── Send Message ───────>│                         │
     │                          ├──── Validate           │
     │                          ├──── Save to DB         │
     │                          ├──── Emit ─────────────>│
     │<──── Confirmation ───────┤                         │
     │                          │                         │
     ├──── Typing ─────────────>│                         │
     │                          ├──── Emit ─────────────>│
```

## Location-Based Discovery

1. **User Location Update:**
   - Mobile app gets GPS coordinates
   - Sends to backend via API
   - Updates Profile table

2. **Nearby User Query:**
   - Request with optional filters
   - Backend queries profiles with location
   - Calculates distances using geolib
   - Filters by preferences (age, gender, distance)
   - Returns sorted list by distance

3. **Privacy Considerations:**
   - Exact locations not shared with other users
   - Only approximate distance shown
   - Users can set max distance preference

## Security Measures

1. **Authentication:**
   - Password hashing with bcrypt
   - JWT tokens with expiration
   - Secure token storage

2. **Authorization:**
   - Middleware validates tokens
   - User-specific data access control
   - Block list enforcement

3. **Data Protection:**
   - Environment-based configuration
   - CORS protection
   - Input validation
   - SQL injection prevention (Prisma)

4. **Privacy:**
   - Block functionality
   - Report system
   - Location privacy (approximate distances)

## Scalability Considerations

### Current Implementation
- Single server deployment
- Direct PostgreSQL connection
- In-memory Socket.IO

### Future Scaling Options
1. **Horizontal Scaling:**
   - Load balancer
   - Multiple backend instances
   - Redis for session management
   - Socket.IO adapter for multi-server

2. **Database:**
   - Read replicas
   - Connection pooling
   - Caching layer (Redis)

3. **Media Storage:**
   - CDN for photos
   - S3 or similar for uploads

4. **Performance:**
   - Database indexing (already implemented)
   - Query optimization
   - Response caching
   - Image optimization

## Deployment Architecture

### Development
```
Local Machine
├── Backend (localhost:3000)
├── PostgreSQL (localhost:5432)
└── Expo Dev Server (localhost:19006)
```

### Production (Recommended)
```
┌─────────────────────────────────────┐
│            Load Balancer             │
└─────────────────────────────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
┌───▼────┐         ┌────▼───┐
│Backend │         │Backend │
│Server 1│         │Server 2│
└───┬────┘         └────┬───┘
    │                   │
    └─────────┬─────────┘
              │
    ┌─────────▼─────────┐
    │    PostgreSQL      │
    │  (with replicas)   │
    └────────────────────┘
```

## Technology Choices

### Why React Native?
- Cross-platform (iOS & Android)
- Large ecosystem
- Hot reload for fast development
- Native performance
- Expo for easier setup

### Why Node.js/Express?
- JavaScript/TypeScript throughout
- Non-blocking I/O for real-time features
- Large ecosystem
- Easy WebSocket integration

### Why PostgreSQL?
- Robust relational database
- PostGIS support for location (future)
- ACID compliance
- JSON support for flexibility

### Why Prisma?
- Type-safe database client
- Automatic migrations
- Great TypeScript support
- Developer-friendly

### Why Socket.IO?
- Easy WebSocket implementation
- Fallback options
- Room support
- Event-based architecture

## Future Enhancements

1. **Features:**
   - Push notifications
   - Video chat
   - Stories
   - Advanced matching algorithm
   - Profile verification

2. **Infrastructure:**
   - Microservices architecture
   - Message queue (RabbitMQ/Kafka)
   - Caching layer (Redis)
   - CDN for media

3. **Analytics:**
   - User behavior tracking
   - Performance monitoring
   - Error tracking (Sentry)

4. **Testing:**
   - Unit tests
   - Integration tests
   - E2E tests
   - Load testing
