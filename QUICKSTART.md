# Quick Start Guide

Get Raiz up and running in minutes!

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

## 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/mtzbmtz01/glowing-raiz.git
cd glowing-raiz

# Install all dependencies
npm run install:all
```

## 2. Setup Database

```bash
# Start PostgreSQL (if not running)
# Mac: brew services start postgresql
# Linux: sudo systemctl start postgresql

# Create database
createdb raiz_db
```

## 3. Configure Backend

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env and update:
# - DATABASE_URL with your PostgreSQL connection string
# - JWT_SECRET with a random secret key

# Generate Prisma client and run migrations
npm run prisma:generate
npm run prisma:migrate
```

## 4. Start Backend

```bash
# From backend directory
npm run dev

# Backend will start on http://localhost:3000
```

## 5. Configure Mobile App

```bash
cd ../mobile

# Update API URLs in src/services/api.ts
# For iOS Simulator: http://localhost:3000
# For Android Emulator: http://10.0.2.2:3000
```

## 6. Start Mobile App

```bash
# From mobile directory
npm start

# Press 'i' for iOS or 'a' for Android
# Or scan QR code with Expo Go app
```

## 7. Create Test Account

1. Open the app
2. Click "Sign up"
3. Fill in the registration form
4. Allow location permissions
5. Start exploring!

## Troubleshooting

### Backend Issues

**Database connection error:**
- Verify PostgreSQL is running
- Check DATABASE_URL in .env file
- Ensure database exists

**Port already in use:**
- Change PORT in .env file
- Update mobile app API URL accordingly

### Mobile Issues

**Cannot connect to backend:**
- Verify backend is running
- Check API URL matches backend address
- For physical device, use computer's IP address

**Location permission denied:**
- Enable location services in device settings
- Grant permission when prompted

**Module not found:**
- Run `npm install` again
- Clear cache: `expo start -c`

## Next Steps

- Read the full [README.md](README.md)
- Check out [CONTRIBUTING.md](CONTRIBUTING.md)
- Explore the API documentation
- Customize the app for your needs

## Need Help?

Open an issue on GitHub with:
- Your environment (OS, Node version, etc.)
- Steps to reproduce the problem
- Error messages and logs
