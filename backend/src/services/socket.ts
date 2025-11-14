import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../utils/jwt';

const prisma = new PrismaClient();

interface AuthSocket extends Socket {
  userId?: string;
}

export const initializeSocket = (httpServer: HTTPServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:19006',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket: AuthSocket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const payload = verifyToken(token);

      if (!payload) {
        return next(new Error('Authentication error: Invalid token'));
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user || user.status !== 'ACTIVE') {
        return next(new Error('Authentication error: User not found or inactive'));
      }

      socket.userId = user.id;
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthSocket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join user to their personal room
    socket.join(`user:${socket.userId}`);

    // Handle sending messages
    socket.on('send_message', async (data) => {
      try {
        const { receiverId, content } = data;

        if (!socket.userId) {
          return socket.emit('error', { message: 'Not authenticated' });
        }

        // Check if blocked
        const isBlocked = await prisma.block.findFirst({
          where: {
            OR: [
              { blockerId: socket.userId, blockedId: receiverId },
              { blockerId: receiverId, blockedId: socket.userId },
            ],
          },
        });

        if (isBlocked) {
          return socket.emit('error', { message: 'Cannot message this user' });
        }

        // Create message
        const message = await prisma.message.create({
          data: {
            senderId: socket.userId,
            receiverId,
            content,
          },
        });

        // Emit to sender
        socket.emit('message_sent', message);

        // Emit to receiver
        io.to(`user:${receiverId}`).emit('new_message', message);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      const { receiverId, isTyping } = data;

      if (!socket.userId) {
        return;
      }

      io.to(`user:${receiverId}`).emit('user_typing', {
        senderId: socket.userId,
        isTyping,
      });
    });

    // Handle message read
    socket.on('mark_read', async (data) => {
      try {
        const { messageId } = data;

        if (!socket.userId) {
          return socket.emit('error', { message: 'Not authenticated' });
        }

        const message = await prisma.message.findUnique({
          where: { id: messageId },
        });

        if (!message || message.receiverId !== socket.userId) {
          return socket.emit('error', { message: 'Message not found' });
        }

        if (!message.isRead) {
          const updatedMessage = await prisma.message.update({
            where: { id: messageId },
            data: {
              isRead: true,
              readAt: new Date(),
            },
          });

          // Notify sender
          io.to(`user:${message.senderId}`).emit('message_read', updatedMessage);
        }
      } catch (error) {
        console.error('Mark read error:', error);
        socket.emit('error', { message: 'Failed to mark message as read' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};
