# Raiz Mobile App

React Native mobile app for the Raiz dating app.

## Features

- Cross-platform (iOS & Android) with React Native
- Built with Expo for easy development
- TypeScript throughout
- GPS-based nearby user discovery
- Real-time chat with Socket.IO
- User authentication and profiles
- Block and report functionality

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Update API URL in `src/services/api.ts` and `src/services/socket.ts`:
   - For iOS Simulator: `http://localhost:3000`
   - For Android Emulator: `http://10.0.2.2:3000`
   - For physical device: Use your computer's IP address

3. Start Expo development server:
   ```bash
   npm start
   ```

4. Run on device/simulator:
   - Press `i` for iOS
   - Press `a` for Android
   - Scan QR code with Expo Go app

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run in web browser

## Project Structure

```
mobile/
├── src/
│   ├── screens/        # App screens/pages
│   ├── navigation/     # Navigation configuration
│   ├── services/       # API and Socket.IO clients
│   ├── components/     # Reusable components
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Helper functions
├── assets/             # Images, fonts, etc.
├── App.tsx             # Application entry point
├── app.json            # Expo configuration
└── package.json
```

## Screens

- **LoginScreen** - User login
- **RegisterScreen** - New user registration
- **HomeScreen** - Nearby users grid
- **ChatsScreen** - List of conversations
- **ChatScreen** - Individual chat conversation
- **ProfileScreen** - User profile management

## Navigation

The app uses React Navigation with a stack and tab navigator:

- Auth Stack (Login, Register)
- Main Tabs (Home, Chats, Profile)
- Modal Stack (Chat, User Profile)

## State Management

Currently using:
- AsyncStorage for local data persistence
- React hooks (useState, useEffect) for component state
- Context API can be added for global state if needed

## Testing on Physical Devices

1. Install Expo Go app from:
   - iOS: App Store
   - Android: Google Play Store

2. Ensure your phone and computer are on the same network

3. Update API URLs to use your computer's IP address:
   ```typescript
   const API_URL = 'http://YOUR_IP_ADDRESS:3000/api';
   const SOCKET_URL = 'http://YOUR_IP_ADDRESS:3000';
   ```

4. Scan the QR code from Expo Dev Tools

## Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

Refer to [Expo documentation](https://docs.expo.dev) for detailed build instructions.
