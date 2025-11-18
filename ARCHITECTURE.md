# Raiz Dating App - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              React Native (Expo) App                        │ │
│  │                                                              │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │ │
│  │  │  Auth    │  │ Discover │  │   Chat   │  │ Profile  │  │ │
│  │  │ Screens  │  │  Screen  │  │ Screens  │  │ Screens  │  │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │ │
│  │                                                              │ │
│  │  ┌────────────────────────────────────────────────────────┐│ │
│  │  │            React Navigation (Stack + Tabs)              ││ │
│  │  └────────────────────────────────────────────────────────┘│ │
│  │                                                              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐│ │
│  │  │ Auth Context │  │  API Client  │  │ Socket.IO Client ││ │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘│ │
│  └──────────────────────────────────────────────────────────┘ │
└───────────────────────────┬───────────────────────────────────┘
                            │
                    HTTPS + WebSocket
                            │
┌───────────────────────────┴───────────────────────────────────┐
│                       SERVER LAYER                              │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Node.js + Express Server                       │ │
│  │                                                              │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │               Middleware Layer                         │  │ │
│  │  │  • CORS            • Rate Limiting                    │  │ │
│  │  │  • JWT Auth        • Input Validation (Zod)          │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                                                              │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────┐  │ │
│  │  │  Auth   │  │ Profile │  │Discovery│  │  Messages   │  │ │
│  │  │ Routes  │  │ Routes  │  │ Routes  │  │   Routes    │  │ │
│  │  └────┬────┘  └────┬────┘  └────┬────┘  └──────┬──────┘  │ │
│  │       │            │             │               │          │ │
│  │  ┌────┴──────┬─────┴─────┬──────┴──────┬────────┴──────┐  │ │
│  │  │           │           │             │               │  │ │
│  │  │  Auth     │  Profile  │  Discovery  │   Message    │  │ │
│  │  │Controller │ Controller│ Controller  │  Controller  │  │ │
│  │  └───────────┴───────────┴─────────────┴──────────────┘  │ │
│  │                                                              │ │
│  │  ┌────────────────────────────────────────────────────────┐│ │
│  │  │              Socket.IO Service                         ││ │
│  │  │  • Real-time messaging    • Typing indicators          ││ │
│  │  │  • Read receipts          • User presence              ││ │
│  │  └────────────────────────────────────────────────────────┘│ │
│  │                                                              │ │
│  │  ┌────────────────────────────────────────────────────────┐│ │
│  │  │              Utility Services                          ││ │
│  │  │  • JWT (sign/verify)     • Password (hash/compare)    ││ │
│  │  │  • Distance (Haversine)  • Database (Prisma)          ││ │
│  │  └────────────────────────────────────────────────────────┘│ │
│  └──────────────────────────────────────────────────────────┘ │
└───────────────────────────┬───────────────────────────────────┘
                            │
                      Prisma ORM
                            │
┌───────────────────────────┴───────────────────────────────────┐
│                      DATA LAYER                                 │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                  PostgreSQL Database                        │ │
│  │                                                              │ │
│  │  ┌────────┐  ┌────────┐  ┌─────────┐  ┌────────┐          │ │
│  │  │  User  │  │Profile │  │ Message │  │ Block  │          │ │
│  │  │  Table │  │ Table  │  │  Table  │  │ Table  │          │ │
│  │  └────────┘  └────────┘  └─────────┘  └────────┘          │ │
│  │                                                              │ │
│  │  ┌────────┐                                                 │ │
│  │  │ Report │                                                 │ │
│  │  │ Table  │                                                 │ │
│  │  └────────┘                                                 │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. User Registration Flow
```
User Input (Email/Password/Profile Info)
    │
    ↓
Frontend: RegisterScreen
    │
    ↓
API Call: POST /api/auth/register
    │
    ↓
Backend: authController.register()
    │
    ├──→ Validate input with Zod
    │
    ├──→ Hash password with bcrypt
    │
    ├──→ Create User + Profile in database
    │
    ├──→ Generate JWT token
    │
    ↓
Return: { token, user }
    │
    ↓
Frontend: Store token, update Context
    │
    ↓
Navigate to Main App
```

### 2. Location-Based Discovery Flow
```
User Opens Discover Screen
    │
    ↓
Frontend: Request location permission
    │
    ↓
Get GPS coordinates
    │
    ↓
API Call: PUT /api/profile/me/location
    │
    ↓
Backend: Update user's location in database
    │
    ↓
API Call: GET /api/discovery/nearby
    │
    ↓
Backend: discoveryController.getNearbyUsers()
    │
    ├──→ Get user's profile & preferences
    │
    ├──→ Query users matching preferences
    │
    ├──→ Filter blocked users
    │
    ├──→ Calculate distances (Haversine)
    │
    ├──→ Sort by distance
    │
    ↓
Return: Array of nearby users with distances
    │
    ↓
Frontend: Display in grid layout
```

### 3. Real-Time Chat Flow
```
User Types Message
    │
    ├──→ Socket.IO: emit('typing', { recipientId, isTyping: true })
    │        │
    │        ↓
    │    Server → Recipient: emit('typing', { userId, isTyping: true })
    │        │
    │        ↓
    │    Recipient sees "User is typing..."
    │
    ↓
User Sends Message
    │
    ↓
Socket.IO: emit('sendMessage', { receiverId, content })
    │
    ↓
Backend: socketService
    │
    ├──→ Check if users are blocked
    │
    ├──→ Save message to database
    │
    ├──→ emit('newMessage') to sender
    │
    ├──→ emit('newMessage') to recipient (if online)
    │
    ↓
Recipients receive message in real-time
    │
    ↓
Recipient opens chat
    │
    ↓
Socket.IO: emit('messageSeen', { messageId })
    │
    ↓
Backend: Update message.seen = true
    │
    ↓
Sender receives read receipt
```

### 4. Block User Flow
```
User Views Profile
    │
    ↓
User Clicks Block Button
    │
    ↓
Confirm Dialog
    │
    ↓
API Call: POST /api/safety/block/:userId
    │
    ↓
Backend: safetyController.blockUser()
    │
    ├──→ Validate user IDs
    │
    ├──→ Check existing block
    │
    ├──→ Create Block record in database
    │
    ↓
Return: { success }
    │
    ↓
Frontend: Navigate back & update UI
    │
    ↓
Blocked user is filtered from:
    • Discovery results
    • Search results
    • Cannot send messages
    • Cannot view profile
```

## Technology Stack Details

### Frontend Stack
```
React Native (0.72.6)
    ├── Expo (~49.0.0) - Development framework
    ├── React Navigation (^6.x) - Navigation
    │   ├── Native Stack Navigator
    │   └── Bottom Tab Navigator
    ├── TypeScript (^5.1.3) - Type safety
    ├── Axios (^1.6.2) - HTTP client
    ├── Socket.IO Client (^4.6.0) - Real-time
    ├── AsyncStorage (1.18.2) - Local storage
    └── Expo Modules
        ├── expo-location - GPS access
        ├── expo-image-picker - Photo selection
        └── expo-auth-session - OAuth flows
```

### Backend Stack
```
Node.js + Express (^4.18.2)
    ├── TypeScript (^5.3.3) - Type safety
    ├── Prisma (^5.7.1) - ORM
    ├── PostgreSQL - Database
    ├── Socket.IO (^4.6.0) - Real-time
    ├── JWT (jsonwebtoken ^9.0.2) - Auth
    ├── bcrypt (^5.1.1) - Password hashing
    ├── Zod (^3.22.4) - Input validation
    ├── express-rate-limit (^7.1.5) - Rate limiting
    └── CORS (^2.8.5) - Cross-origin
```

## Security Architecture

### Authentication Flow
```
1. User Login
   ↓
2. Hash password comparison (bcrypt)
   ↓
3. Generate JWT token (7-day expiry)
   ↓
4. Store token in AsyncStorage
   ↓
5. Include token in Authorization header
   ↓
6. JWT middleware verifies token
   ↓
7. Extract userId from token
   ↓
8. Attach to request object
   ↓
9. Controller accesses req.userId
```

### Security Layers
```
┌──────────────────────────────────────┐
│    Rate Limiting (100 req/15min)     │
├──────────────────────────────────────┤
│    CORS (Configured origins)         │
├──────────────────────────────────────┤
│    Input Validation (Zod schemas)    │
├──────────────────────────────────────┤
│    JWT Authentication                 │
├──────────────────────────────────────┤
│    Password Hashing (bcrypt)         │
├──────────────────────────────────────┤
│    SQL Injection Protection (Prisma) │
├──────────────────────────────────────┤
│    XSS Protection (React/RN)         │
└──────────────────────────────────────┘
```

## Database Schema Relationships

```
User (1) ──────< (1) Profile
  │
  ├──< (Many) Message [as sender]
  │
  ├──< (Many) Message [as receiver]
  │
  ├──< (Many) Block [as blocker]
  │
  ├──< (Many) Block [as blocked]
  │
  ├──< (Many) Report [as reporter]
  │
  └──< (Many) Report [as reported]

Indexes:
  • User: email, status
  • Profile: userId, (latitude, longitude)
  • Message: (senderId, receiverId), (receiverId, seen), createdAt
  • Block: blockerId, blockedId, (blockerId, blockedId) UNIQUE
  • Report: reporterId, reportedId, resolved
```

## Deployment Architecture (Recommended)

```
┌──────────────────────────────────────────────────────────┐
│                   CDN / Edge Network                      │
│                  (Static Assets, Images)                  │
└────────────────────────┬─────────────────────────────────┘
                         │
┌────────────────────────┴─────────────────────────────────┐
│              Load Balancer (HTTPS/WSS)                    │
└────────────────────────┬─────────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          │                             │
┌─────────┴──────────┐      ┌──────────┴─────────┐
│  App Server 1      │      │  App Server 2      │
│  (Node.js + Socket)│      │  (Node.js + Socket)│
└─────────┬──────────┘      └──────────┬─────────┘
          │                             │
          └──────────────┬──────────────┘
                         │
┌────────────────────────┴─────────────────────────────────┐
│            PostgreSQL Database (Primary)                  │
│                    + Read Replicas                        │
└──────────────────────────────────────────────────────────┘

Additional Services:
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Redis (Session  │  │  S3/Cloudinary   │  │  Email Service   │
│  & Socket.IO)    │  │  (Photo Storage) │  │  (SendGrid/SES)  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

## Performance Optimizations

### Database Optimizations
- Indexed foreign keys and frequently queried fields
- Pagination for large datasets (20-100 items per page)
- Limited result sets (max 50 nearby users, max 100 messages)
- Efficient queries with Prisma's query optimization

### API Optimizations
- Rate limiting to prevent abuse
- Caching strategies (can implement Redis)
- Gzip compression for responses
- Efficient distance calculations (pre-filtering before Haversine)

### Frontend Optimizations
- Image lazy loading and caching
- Virtual lists for long conversations
- Debounced typing indicators
- Optimistic UI updates
- Minimal re-renders with React.memo and useMemo

### Real-Time Optimizations
- Socket.IO room-based messaging
- Binary data support for Socket.IO
- Automatic reconnection handling
- Message queuing for offline users

## Scalability Considerations

### Horizontal Scaling
- Stateless API servers (multiple instances)
- Socket.IO with Redis adapter for multi-server
- Database read replicas
- CDN for static assets

### Vertical Scaling
- Database optimization and tuning
- Connection pooling (Prisma)
- Memory optimization
- CPU-intensive tasks offloading

### Future Scaling Options
- Microservices architecture
- Message queue (RabbitMQ, Kafka)
- Elasticsearch for advanced search
- GraphQL for flexible queries
- Caching layer (Redis, Memcached)

## Monitoring & Observability

### Recommended Tools
```
Application Monitoring:
├── New Relic / Datadog - APM
├── Sentry - Error tracking
└── LogRocket - Session replay

Infrastructure Monitoring:
├── AWS CloudWatch / Azure Monitor
├── Prometheus + Grafana
└── Uptime monitoring (Pingdom, UptimeRobot)

Database Monitoring:
├── Prisma Studio - Database browser
├── pgAdmin - PostgreSQL admin
└── Database query analyzer
```

## Conclusion

This architecture provides:
- ✅ Scalability for growth
- ✅ Security best practices
- ✅ Real-time capabilities
- ✅ Maintainable codebase
- ✅ Clear separation of concerns
- ✅ Type safety throughout
- ✅ Production-ready foundation
