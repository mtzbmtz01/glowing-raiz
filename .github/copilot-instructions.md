# Copilot Instructions for Raiz Dating App

This document provides instructions for GitHub Copilot when working on this repository.

## Project Overview

Raiz is a modern dating app built with:
- **Backend**: Node.js + Express + TypeScript + Prisma ORM + PostgreSQL + Socket.IO
- **Frontend**: React Native + Expo + TypeScript
- **Shared**: Common TypeScript types between frontend and backend

## Project Structure

```
glowing-raiz/
├── backend/              # Node.js Express API (TypeScript)
│   ├── prisma/          # Database schema
│   └── src/             # Controllers, middleware, routes, services
├── frontend/            # React Native Expo app (TypeScript)
│   └── src/             # Contexts, navigation, screens, services
├── shared/              # Shared TypeScript types
├── src/                 # Root-level simple backend (JavaScript)
└── tests/               # Root-level tests
```

## Build and Test Commands

### Root Level
```bash
npm install              # Install dependencies
npm run dev              # Start development server
npm run test             # Run tests
```

### Backend
```bash
cd backend
npm install              # Install dependencies
npm run dev              # Start development server with hot-reload
npm run build            # Build for production
npm run lint             # Run ESLint
npm run prisma:generate  # Generate Prisma client
npm run prisma:push      # Push schema to database
```

### Frontend
```bash
cd frontend
npm install              # Install dependencies
npm start                # Start Expo dev server
npm run lint             # Run ESLint
npm run ios              # Run on iOS simulator
npm run android          # Run on Android emulator
```

## Code Style and Conventions

### TypeScript
- Use TypeScript for all new code in backend and frontend
- Enable strict mode in TypeScript configuration
- Use explicit type annotations for function parameters and return types
- Prefer interfaces over type aliases for object shapes

### Naming Conventions
- Use camelCase for variables and functions
- Use PascalCase for classes, interfaces, and React components
- Use SCREAMING_SNAKE_CASE for constants
- Use kebab-case for file names in routes and URL paths

### Backend Conventions
- Use Express.js middleware pattern for request handling
- Use Zod for input validation in API endpoints
- Use JWT for authentication with tokens stored in Authorization header
- Use Prisma ORM for all database operations (no raw SQL)
- Follow RESTful API design principles
- Use async/await for asynchronous operations

### Frontend Conventions
- Use functional components with React hooks
- Use React Context API for state management
- Use React Navigation for routing
- Use Axios for HTTP requests
- Use Socket.IO client for real-time features
- Store authentication tokens in AsyncStorage

## Security Guidelines

- Never commit secrets or credentials to the repository
- Hash all passwords using bcrypt before storage
- Validate all user input with Zod schemas
- Use rate limiting on API endpoints
- Check for blocked users before allowing interactions
- Verify JWT tokens on all protected routes

## Database Guidelines

- All database changes should go through Prisma migrations
- Use indexed fields for frequently queried columns
- Implement pagination for list endpoints (20-100 items per page)
- Filter blocked users from discovery and message queries

## Testing Guidelines

- Write tests for new features and bug fixes
- Tests should be self-contained and not depend on external services
- Use descriptive test names that explain the expected behavior
- Run `npm run test` at the root level to verify changes

## Real-time Features

- Socket.IO is used for real-time messaging
- Authenticate socket connections with JWT tokens
- Emit events for: sendMessage, typing, messageSeen
- Listen for events: newMessage, typing, messageSeen

## Pull Request Guidelines

- Keep changes focused and minimal
- Include tests for new functionality
- Ensure all linting passes before submitting
- Update documentation if API changes are made
