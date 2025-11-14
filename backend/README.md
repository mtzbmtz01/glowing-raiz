# Raiz Backend API

Node.js/Express backend for the Raiz dating app.

## Features

- RESTful API with Express
- PostgreSQL database with Prisma ORM
- JWT authentication
- Socket.IO for real-time messaging
- TypeScript throughout
- GPS-based user discovery

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Configure your database connection and other environment variables in `.env`

4. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```

5. Run migrations:
   ```bash
   npm run prisma:migrate
   ```

6. Start development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## API Documentation

See the main [README.md](../README.md) for complete API documentation.

## Project Structure

```
backend/
├── src/
│   ├── controllers/    # Request handlers
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic
│   ├── middleware/     # Express middleware
│   ├── types/          # TypeScript type definitions
│   ├── config/         # Configuration files
│   └── index.ts        # Application entry point
├── prisma/
│   └── schema.prisma   # Database schema
├── package.json
└── tsconfig.json
```

## Environment Variables

Required environment variables (see `.env.example`):

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 3000)
- `FRONTEND_URL` - Frontend URL for CORS
- OAuth credentials (optional)

## Database Schema

The application uses the following models:

- **User** - User accounts and authentication
- **Profile** - User profiles with preferences
- **Message** - Chat messages
- **Block** - Blocked users
- **Report** - User reports

See `prisma/schema.prisma` for the complete schema.

## Socket.IO Events

### Client → Server
- `send-message` - Send a chat message
- `typing` - User started typing
- `stop-typing` - User stopped typing

### Server → Client
- `new-message` - Receive new message
- `message-sent` - Confirmation of sent message
- `user-typing` - Other user is typing
- `user-stop-typing` - Other user stopped typing
- `user-online` - User came online
- `user-offline` - User went offline
