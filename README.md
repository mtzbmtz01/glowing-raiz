# Raiz - Dating App

A full-stack dating application similar to Grindr but for heterosexual users. Built with React Native (Expo), Node.js/Express, PostgreSQL (Prisma), and Socket.IO.

## Features

- 📍 **GPS-based nearby users** - Find people near you with real-time location
- 👤 **Rich user profiles** - Photos, bio, preferences, and more
- 🔐 **Multiple authentication methods** - Email, Apple, and Google OAuth
- 🎯 **Advanced filters** - Distance, age, and gender preferences
- 💬 **Real-time chat** - Socket.IO powered instant messaging
- 🚫 **Block & Report** - Safety features to manage interactions
- 📱 **Clean mobile UI** - Built with React Native and Expo
- 🔒 **TypeScript throughout** - Type-safe code for better maintainability

## Tech Stack

### Backend
- Node.js & Express
- TypeScript
- PostgreSQL with Prisma ORM
- Socket.IO for real-time messaging
- JWT authentication
- Passport.js for OAuth

### Frontend (Mobile)
- React Native (Expo)
- TypeScript
- React Navigation
- Socket.IO Client
- Axios for API calls
- AsyncStorage for local data

## Project Structure

```
glowing-raiz/
├── backend/           # Node.js/Express API server
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Auth & validation
│   │   ├── types/         # TypeScript types
│   │   ├── config/        # Configuration
│   │   └── index.ts       # Server entry point
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── package.json
│
└── mobile/            # React Native mobile app
    ├── src/
    │   ├── screens/       # App screens
    │   ├── navigation/    # Navigation setup
    │   ├── services/      # API & Socket services
    │   ├── types/         # TypeScript types
    │   └── utils/         # Helper functions
    ├── App.tsx            # App entry point
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Expo CLI (`npm install -g expo-cli`)
- Git

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   - PostgreSQL connection string
   - JWT secret
   - OAuth credentials (optional)

5. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```

6. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

The backend will be available at `http://localhost:3000`

### Mobile App Setup

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the API URL in `src/services/api.ts` and `src/services/socket.ts` to match your backend:
   - For iOS Simulator: `http://localhost:3000`
   - For Android Emulator: `http://10.0.2.2:3000`
   - For physical device: Use your computer's IP address

4. Start the Expo development server:
   ```bash
   npm start
   ```

5. Run the app:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your physical device

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Profiles
- `PUT /api/profiles/me` - Update profile
- `GET /api/profiles/:userId` - Get user profile
- `GET /api/profiles/nearby` - Get nearby users

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/:otherUserId` - Get conversation with user
- `PUT /api/messages/:messageId/read` - Mark message as read

### Block/Report
- `POST /api/blocks` - Block user
- `DELETE /api/blocks/:blockedId` - Unblock user
- `GET /api/blocks` - Get blocked users
- `POST /api/reports` - Report user
- `GET /api/reports` - Get reports

## Socket.IO Events

### Client to Server
- `send-message` - Send a message
- `typing` - User is typing
- `stop-typing` - User stopped typing

### Server to Client
- `new-message` - Receive new message
- `message-sent` - Message sent confirmation
- `user-typing` - User is typing notification
- `user-stop-typing` - User stopped typing
- `user-online` - User came online
- `user-offline` - User went offline

## Database Schema

The app uses PostgreSQL with the following main tables:
- **User** - Authentication and user data
- **Profile** - User profile information and preferences
- **Message** - Chat messages
- **Block** - Blocked users
- **Report** - User reports

See `backend/prisma/schema.prisma` for the complete schema.

## Development

### Backend Development
```bash
cd backend
npm run dev  # Start with auto-reload
```

### Mobile Development
```bash
cd mobile
npm start  # Start Expo dev server
```

### Database Management
```bash
cd backend
npm run prisma:studio  # Open Prisma Studio (DB GUI)
npm run prisma:migrate  # Run migrations
```

## Features to Implement (Future)

- [ ] Photo upload functionality
- [ ] Push notifications
- [ ] Advanced matching algorithms
- [ ] Profile verification
- [ ] Video chat
- [ ] Stories feature
- [ ] Premium subscription
- [ ] Admin dashboard

## Security

- JWT tokens for authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Environment-based configuration
- Block and report functionality

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License

## Support

For issues and questions, please open an issue in the GitHub repository. 
