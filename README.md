# Raiz - Dating App

A modern dating app built with React Native (Expo) and Node.js, similar to popular dating platforms but tailored for heterosexual users.

## Features

### Authentication
- Email + Password authentication
- Apple Sign-In integration
- Google OAuth integration
- JWT-based secure sessions

### User Profiles
- Photo gallery support
- Bio and interests
- Age, gender, and orientation settings
- Customizable preferences (gender, distance, age range)

### Discovery
- Location-based grid view of nearby users
- Real-time distance calculation
- Filter by preferences
- Swipe through user profiles

### Messaging
- Real-time 1:1 chat powered by Socket.IO
- Typing indicators
- Message seen/read receipts
- Conversation history

### Safety Features
- Block users
- Report inappropriate content or behavior
- Multiple report categories

### Admin Dashboard
- View all users
- Suspend/activate user accounts
- Review reports
- Platform statistics

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Real-time**: Socket.IO
- **Authentication**: JWT
- **Language**: TypeScript

### Frontend
- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **State Management**: React Context API
- **Real-time**: Socket.IO Client
- **Language**: TypeScript

## Project Structure

```
glowing-raiz/
├── backend/              # Node.js Express API
│   ├── prisma/          # Database schema
│   ├── src/
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Auth & other middleware
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   ├── utils/       # Utility functions
│   │   └── index.ts     # Server entry point
│   └── package.json
├── frontend/            # React Native Expo app
│   ├── src/
│   │   ├── contexts/    # React contexts
│   │   ├── navigation/  # Navigation setup
│   │   ├── screens/     # App screens
│   │   ├── services/    # API & Socket services
│   │   └── types/       # TypeScript types
│   ├── App.tsx
│   └── package.json
└── shared/              # Shared types
    └── types/

```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Studio (for mobile development)

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

4. Edit `.env` and configure:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: A secure random string
   - OAuth credentials (optional)

5. Set up the database:
```bash
npm run prisma:generate
npm run prisma:push
```

6. Start the development server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:3000`

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

4. Edit `.env` and configure API URLs to point to your backend

5. Start the Expo development server:
```bash
npm start
```

6. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your device

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Profile
- `GET /api/profile/me` - Get own profile
- `PUT /api/profile/me` - Update profile
- `PUT /api/profile/me/location` - Update location
- `GET /api/profile/:userId` - Get user profile

### Discovery
- `GET /api/discovery/nearby` - Get nearby users

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/conversations/:userId` - Get conversation with user
- `PUT /api/messages/:messageId/seen` - Mark message as seen
- `PUT /api/messages/conversations/:userId/seen` - Mark conversation as seen

### Safety
- `POST /api/safety/block/:userId` - Block user
- `DELETE /api/safety/block/:userId` - Unblock user
- `GET /api/safety/blocked` - Get blocked users
- `POST /api/safety/report` - Report user

### Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:userId/suspend` - Suspend user
- `PUT /api/admin/users/:userId/activate` - Activate user
- `GET /api/admin/reports` - Get all reports
- `PUT /api/admin/reports/:reportId/resolve` - Resolve report
- `GET /api/admin/stats` - Get platform statistics

## Socket.IO Events

### Client → Server
- `sendMessage` - Send a new message
- `typing` - Send typing indicator
- `messageSeen` - Mark message as seen

### Server → Client
- `newMessage` - Receive new message
- `typing` - Receive typing indicator
- `messageSeen` - Message seen notification

## Development

### Backend
```bash
cd backend
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

### Frontend
```bash
cd frontend
npm start          # Start Expo dev server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web
npm run lint       # Run ESLint
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting on API endpoints
- Input validation with Zod
- SQL injection protection via Prisma ORM
- CORS configuration
- Secure Socket.IO authentication

## Future Enhancements

- Photo upload functionality with cloud storage
- Push notifications
- Advanced matching algorithm
- Video chat support
- Super likes and premium features
- Email verification
- Password reset functionality
- More detailed admin analytics

## License

ISC

## Contributing

This is a demonstration project. For production use, additional security hardening, testing, and features should be implemented.
