# Raiz Dating App - Quick Start Guide

Get the Raiz dating app running locally in under 10 minutes!

## Prerequisites Checklist

Before starting, ensure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ npm or yarn installed (`npm --version`)
- ✅ PostgreSQL 14+ installed and running
- ✅ Git installed
- ✅ Code editor (VS Code recommended)

**For Mobile Development:**
- ✅ Expo CLI (`npm install -g expo-cli`)
- ✅ iOS Simulator (Mac) or Android Studio
- ✅ Expo Go app on your phone (optional)

## Quick Setup (5 Steps)

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd glowing-raiz

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Database Setup

```bash
# Create PostgreSQL database
createdb raiz_db

# Or using psql
psql postgres
CREATE DATABASE raiz_db;
\q

# Set up environment variables
cd ../backend
cp .env.example .env

# Edit .env and set your DATABASE_URL
# Example: DATABASE_URL="postgresql://username:password@localhost:5432/raiz_db"
```

### Step 3: Initialize Database

```bash
# Still in backend directory
npm run prisma:generate
npm run prisma:push

# This creates all tables and generates Prisma Client
```

### Step 4: Start Backend Server

```bash
# In backend directory
npm run dev

# You should see:
# 🚀 Server running on port 3000
# Database connected successfully
```

### Step 5: Start Frontend App

```bash
# Open new terminal, navigate to frontend
cd frontend

# Copy environment file
cp .env.example .env

# Start Expo
npm start

# Choose your platform:
# Press 'i' for iOS simulator
# Press 'a' for Android emulator
# Scan QR code with Expo Go app
```

## Verification

### Test Backend API
```bash
# In a new terminal
curl http://localhost:3000/health

# Expected response:
# {"status":"ok","timestamp":"2024-..."}
```

### Test Frontend Connection
1. Open the app on your device/simulator
2. You should see the Login screen
3. Try registering a new user
4. If successful, you'll be logged in!

## Common Issues & Solutions

### Issue: Database Connection Failed
**Solution:**
```bash
# Check PostgreSQL is running
psql --version
brew services list | grep postgresql  # macOS
systemctl status postgresql           # Linux

# Verify DATABASE_URL in backend/.env
# Make sure username, password, and database name are correct
```

### Issue: Port 3000 Already in Use
**Solution:**
```bash
# Change PORT in backend/.env
echo "PORT=3001" >> backend/.env

# Update frontend/.env to match
echo "EXPO_PUBLIC_API_URL=http://localhost:3001/api" >> frontend/.env
```

### Issue: Prisma Client Not Generated
**Solution:**
```bash
cd backend
npm run prisma:generate
```

### Issue: Expo Not Starting
**Solution:**
```bash
# Clear Expo cache
cd frontend
rm -rf node_modules
npm install
npx expo start -c
```

### Issue: TypeScript Errors
**Solution:**
```bash
# Rebuild TypeScript
cd backend
npm run build

cd ../frontend
npx tsc --noEmit
```

## Sample User Creation

Once the app is running, create your first user:

**Via API (Terminal):**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "age": 25,
    "gender": "MALE",
    "orientation": "STRAIGHT"
  }'
```

**Via Frontend:**
1. Open the app
2. Tap "Sign up"
3. Fill in the registration form
4. Tap "Sign Up"

## Testing Features

### 1. Test Discovery
```bash
# Create a second user with a different email
# Login with both users on different devices/simulators
# Update location for both users
# Both should appear in each other's discovery grid
```

### 2. Test Chat
```bash
# With two users logged in:
# User A: Navigate to Discover → Tap User B → Message
# User B: Check Messages tab
# Send messages back and forth
# Observe typing indicators and read receipts
```

### 3. Test Block/Report
```bash
# User A: View User B's profile
# Tap the block icon
# Confirm block
# User B should no longer appear in discovery
# Messages should be blocked
```

## Development Workflow

### Backend Development
```bash
cd backend

# Watch mode for auto-reload
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Database migrations
npm run prisma:migrate
```

### Frontend Development
```bash
cd frontend

# Start with cache clear
npm start -- -c

# Run on specific platform
npm run ios
npm run android
npm run web

# Check types
npx tsc --noEmit

# Run linter
npm run lint
```

## Environment Variables Reference

### Backend (.env)
```bash
# Required
DATABASE_URL="postgresql://user:pass@localhost:5432/raiz_db"
JWT_SECRET="your-secret-key-min-32-chars"

# Optional (with defaults)
PORT=3000
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:19006

# For OAuth (when implementing)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_TEAM_ID=
APPLE_KEY_ID=
```

### Frontend (.env)
```bash
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000
```

## Useful Commands

### Database Management
```bash
# View database in browser
npx prisma studio

# Reset database (WARNING: Deletes all data!)
npx prisma migrate reset

# Create migration
npx prisma migrate dev --name your_migration_name

# View migrations
npx prisma migrate status
```

### Debug Mode
```bash
# Backend with inspector
cd backend
node --inspect src/index.ts

# Frontend with debugger
cd frontend
npm start
# Then press 'shift+m' to open dev menu
```

### Production Build
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
eas build --platform ios    # for iOS
eas build --platform android # for Android
```

## Next Steps

After successful setup:

1. **Customize Configuration**
   - Update JWT secret
   - Configure OAuth providers
   - Set up cloud storage for photos

2. **Add Test Data**
   - Create multiple test users
   - Add profile photos (URLs)
   - Test all features thoroughly

3. **Deploy to Staging**
   - Set up hosting (Heroku, AWS, DigitalOcean)
   - Configure production database
   - Set up environment variables
   - Test in staging environment

4. **Implement Additional Features**
   - Photo upload functionality
   - Push notifications
   - Email verification
   - Password reset

## Getting Help

### Documentation
- See `README.md` for detailed documentation
- See `ARCHITECTURE.md` for system architecture
- See `IMPLEMENTATION_SUMMARY.md` for feature details

### Common Resources
- [Prisma Documentation](https://www.prisma.io/docs)
- [Expo Documentation](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [Socket.IO Documentation](https://socket.io/docs)

### Troubleshooting
1. Check all services are running (PostgreSQL, Backend, Frontend)
2. Verify environment variables are set correctly
3. Check console logs for error messages
4. Clear caches and rebuild
5. Review documentation for specific features

## Success! 🎉

If you can:
- ✅ Register a new user
- ✅ See the discovery screen
- ✅ Send a message
- ✅ View your profile

Congratulations! Your Raiz dating app is running successfully!

## What's Next?

Explore the codebase:
- `backend/src/controllers/` - API business logic
- `frontend/src/screens/` - UI screens
- `backend/prisma/schema.prisma` - Database schema
- `shared/types/` - Shared TypeScript types

Happy coding! 🚀
