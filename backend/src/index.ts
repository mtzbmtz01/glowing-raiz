import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from './config';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import messageRoutes from './routes/messageRoutes';
import blockRoutes from './routes/blockRoutes';
import reportRoutes from './routes/reportRoutes';
import { MessageService } from './services/messageService';
import jwt from 'jsonwebtoken';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: config.frontendUrl,
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({
  origin: config.frontendUrl,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/blocks', blockRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Socket.IO for real-time chat
const userSockets = new Map<string, string>(); // userId -> socketId

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error'));
  }
  
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
    socket.data.userId = decoded.userId;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.data.userId;
  console.log(`User connected: ${userId}`);
  
  // Store user's socket
  userSockets.set(userId, socket.id);
  
  // Notify user is online
  socket.broadcast.emit('user-online', { userId });
  
  // Handle sending messages
  socket.on('send-message', async (data: { receiverId: string; content: string }) => {
    try {
      const message = await MessageService.sendMessage(userId, data);
      
      // Send to receiver if online
      const receiverSocketId = userSockets.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('new-message', message);
      }
      
      // Acknowledge to sender
      socket.emit('message-sent', message);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  });
  
  // Handle typing indicator
  socket.on('typing', (data: { receiverId: string }) => {
    const receiverSocketId = userSockets.get(data.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user-typing', { userId });
    }
  });
  
  socket.on('stop-typing', (data: { receiverId: string }) => {
    const receiverSocketId = userSockets.get(data.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user-stop-typing', { userId });
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${userId}`);
    userSockets.delete(userId);
    socket.broadcast.emit('user-offline', { userId });
  });
});

// Start server
httpServer.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

export { app, io };
