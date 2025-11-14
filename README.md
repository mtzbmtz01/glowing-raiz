# Raiz - Location-Based Dating App

A full-stack location-based dating application similar to Grindr, built with React Native (Expo) and Node.js.

## Tech Stack

### Frontend
- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for navigation
- **Socket.IO Client** for real-time messaging
- **Axios** for API requests
- **Expo Location** for GPS functionality
- **Expo Secure Store** for secure token storage

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Prisma ORM** with PostgreSQL
- **Socket.IO** for real-time features
- **JWT** for authentication
- **bcryptjs** for password hashing
- **AWS SDK** for S3 photo storage

## Features

- ✅ Email/password authentication
- ✅ Apple and Google OAuth (placeholder implementation)
- ✅ User profiles with photos, bio, interests
- ✅ Location-based user discovery
- ✅ Adjustable search radius (10-100 miles)
- ✅ Grid view of nearby users sorted by distance
- ✅ Real-time 1:1 messaging with Socket.IO
- ✅ Typing indicators and read receipts
- ✅ Block and report users
- ✅ Admin dashboard for user management
- ✅ Profile preferences (gender, age range, distance)

## Project Structure

```
glowing-raiz/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── controllers/           # Request handlers
│   │   │   ├── authController.ts
│   │   │   ├── profileController.ts
│   │   │   ├── matchController.ts
│   │   │   ├── chatController.ts
│   │   │   └── adminController.ts
│   │   ├── routes/                # API routes
│   │   │   ├── auth.ts
│   │   │   ├── profile.ts
│   │   │   ├── match.ts
│   │   │   ├── chat.ts
│   │   │   └── admin.ts
│   │   ├── middleware/            # Middleware functions
│   │   │   └── auth.ts
│   │   ├── services/              # Business logic
│   │   │   └── socket.ts
│   │   ├── utils/                 # Utility functions
│   │   │   ├── jwt.ts
│   │   │   ├── password.ts
│   │   │   └── distance.ts
│   │   ├── types/                 # TypeScript types
│   │   │   └── index.ts
│   │   └── index.ts               # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── screens/               # React Native screens
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   ├── HomeGridScreen.tsx
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── EditProfileScreen.tsx
│   │   │   ├── ChatListScreen.tsx
│   │   │   ├── ChatRoomScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   ├── navigation/            # Navigation setup
│   │   │   └── AppNavigator.tsx
│   │   ├── services/              # API and Socket.IO
│   │   │   ├── api.ts
│   │   │   └── socket.ts
│   │   ├── utils/                 # Utilities
│   │   │   └── AuthContext.tsx
│   │   └── types/                 # TypeScript types
│   │       └── index.ts
│   ├── App.tsx
│   ├── app.json
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Expo CLI (`npm install -g expo-cli`)
- AWS account (for S3 photo storage)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/raiz?schema=public"
JWT_SECRET="your-secret-key"
PORT=3000
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_S3_BUCKET="raiz-photos"
FRONTEND_URL="http://localhost:19006"
```

4. Set up the database:
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env`:
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

4. Start the Expo development server:
```bash
npm start
```

5. Run on your device:
- Scan the QR code with Expo Go app (iOS/Android)
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser

## API Endpoints

### Authentication

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "John Doe",
  "age": 25,
  "gender": "MALE",
  "orientation": "STRAIGHT"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt-token",
  "user": { ... }
}
```

#### Apple Sign In
```
POST /api/auth/apple
Content-Type: application/json

{
  "idToken": "apple-id-token",
  "user": {
    "email": "user@example.com",
    "name": { "firstName": "John", "lastName": "Doe" }
  }
}
```

#### Google Sign In
```
POST /api/auth/google
Content-Type: application/json

{
  "idToken": "google-id-token"
}
```

### Profile

#### Get My Profile
```
GET /api/profile/me
Authorization: Bearer <token>
```

#### Get User Profile
```
GET /api/profile/:userId
Authorization: Bearer <token>
```

#### Update Profile
```
PUT /api/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "displayName": "John Doe",
  "bio": "Hello!",
  "age": 26,
  "interests": ["music", "travel"]
}
```

#### Update Location
```
PUT /api/profile/location
Authorization: Bearer <token>
Content-Type: application/json

{
  "latitude": 37.7749,
  "longitude": -122.4194
}
```

#### Upload Photo
```
POST /api/profile/photos
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://s3.amazonaws.com/...",
  "key": "photos/user-123/photo.jpg",
  "isProfile": true
}
```

#### Delete Photo
```
DELETE /api/profile/photos/:photoId
Authorization: Bearer <token>
```

### Matching

#### Get Nearby Users
```
GET /api/match/nearby?radius=25&minAge=18&maxAge=99&limit=50&offset=0
Authorization: Bearer <token>

Response:
{
  "users": [
    {
      "id": "user-id",
      "email": "user@example.com",
      "profile": { ... },
      "distance": 2.5
    }
  ],
  "total": 10
}
```

#### Create Match
```
POST /api/match
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user-id"
}
```

#### Get Matches
```
GET /api/match
Authorization: Bearer <token>
```

#### Block User
```
POST /api/match/block
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user-id"
}
```

#### Report User
```
POST /api/match/report
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user-id",
  "reason": "Inappropriate behavior"
}
```

### Chat

#### Get Conversations
```
GET /api/chat/conversations
Authorization: Bearer <token>
```

#### Get Messages
```
GET /api/chat/:userId?limit=50&offset=0
Authorization: Bearer <token>
```

#### Send Message
```
POST /api/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiverId": "user-id",
  "content": "Hello!"
}
```

### Admin

#### Get All Users
```
GET /api/admin/users?limit=50&offset=0&status=ACTIVE
Authorization: Bearer <token>
```

#### Suspend User
```
PUT /api/admin/users/:userId/suspend
Authorization: Bearer <token>
```

#### Unsuspend User
```
PUT /api/admin/users/:userId/unsuspend
Authorization: Bearer <token>
```

#### Get Reports
```
GET /api/admin/reports?resolved=false&limit=50&offset=0
Authorization: Bearer <token>
```

#### Resolve Report
```
PUT /api/admin/reports/:reportId/resolve
Authorization: Bearer <token>
```

## Socket.IO Events

### Client → Server

#### Connect
```javascript
socket.emit('connect', { token: 'jwt-token' });
```

#### Send Message
```javascript
socket.emit('send_message', {
  receiverId: 'user-id',
  content: 'Hello!'
});
```

#### Typing Indicator
```javascript
socket.emit('typing', {
  receiverId: 'user-id',
  isTyping: true
});
```

#### Mark Message Read
```javascript
socket.emit('mark_read', {
  messageId: 'message-id'
});
```

### Server → Client

#### New Message
```javascript
socket.on('new_message', (message) => {
  // Handle new message
});
```

#### Message Sent
```javascript
socket.on('message_sent', (message) => {
  // Confirmation that message was sent
});
```

#### User Typing
```javascript
socket.on('user_typing', ({ senderId, isTyping }) => {
  // Show/hide typing indicator
});
```

#### Message Read
```javascript
socket.on('message_read', (message) => {
  // Update message read status
});
```

## Database Schema

### User
- id, email, passwordHash, authProvider, appleId, googleId
- status (ACTIVE, SUSPENDED, DELETED)
- createdAt, updatedAt, lastActiveAt

### Profile
- id, userId, displayName, bio, age, gender, orientation
- interests (array)
- latitude, longitude, locationUpdatedAt
- searchRadius, minAge, maxAge, genderPreference

### Photo
- id, profileId, url, key, order, isProfile

### Message
- id, senderId, receiverId, content
- isRead, readAt, createdAt

### Match
- id, initiatorId, receiverId, createdAt

### Block
- id, blockerId, blockedId, createdAt

### Report
- id, reporterId, reportedId, reason
- resolved, resolvedAt, createdAt

### Session
- id, userId, token, refreshToken, expiresAt

## Development

### Running Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Building for Production

#### Backend
```bash
cd backend
npm run build
npm start
```

#### Frontend
```bash
cd frontend
expo build:android
expo build:ios
```

## Security Considerations

- JWT tokens stored securely using Expo SecureStore
- Passwords hashed with bcryptjs
- API endpoints protected with authentication middleware
- User blocking prevents all interactions
- Reports stored for admin review
- Location data only shared with nearby users

## TODO / Future Enhancements

- [ ] Implement actual Apple Sign In verification
- [ ] Implement actual Google Sign In verification
- [ ] Implement S3 photo upload with presigned URLs
- [ ] Add photo compression and optimization
- [ ] Implement push notifications
- [ ] Add email verification
- [ ] Add password reset functionality
- [ ] Implement profile verification badges
- [ ] Add advanced filters (ethnicity, body type, etc.)
- [ ] Implement "taps" or "likes" feature
- [ ] Add photo albums
- [ ] Implement video chat
- [ ] Add activity feed
- [ ] Implement location-based events

## License

MIT

## Support

For support, please email support@raiz.app or open an issue on GitHub. 
