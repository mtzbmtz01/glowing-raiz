import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { verifyToken } from '../utils/jwt';
import { prisma } from '../utils/db';

interface AuthSocket extends Socket {
  userId?: string;
}

const userSockets = new Map<string, string>(); // userId -> socketId

export const initializeSocket = (server: HTTPServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST'],
    },
  });

  // Authentication middleware
  io.use((socket: AuthSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = verifyToken(token);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthSocket) => {
    console.log(`User connected: ${socket.userId}`);

    if (socket.userId) {
      userSockets.set(socket.userId, socket.id);

      // Update user's last active status
      prisma.user
        .update({
          where: { id: socket.userId },
          data: { lastActive: new Date() },
        })
        .catch(err => console.error('Error updating last active:', err));
    }

    // Handle typing indicator
    socket.on('typing', (data: { recipientId: string; isTyping: boolean }) => {
      const recipientSocketId = userSockets.get(data.recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('typing', {
          userId: socket.userId,
          isTyping: data.isTyping,
        });
      }
    });

    // Handle new message
    socket.on('sendMessage', async (data: { receiverId: string; content: string }) => {
      try {
        // Check if users are blocked
        const isBlocked = await prisma.block.findFirst({
          where: {
            OR: [
              { blockerId: socket.userId, blockedId: data.receiverId },
              { blockerId: data.receiverId, blockedId: socket.userId },
            ],
          },
        });

        if (isBlocked) {
          socket.emit('error', { message: 'Cannot send message to this user' });
          return;
        }

        const message = await prisma.message.create({
          data: {
            senderId: socket.userId!,
            receiverId: data.receiverId,
            content: data.content,
          },
        });

        // Send to sender
        socket.emit('newMessage', message);

        // Send to recipient if online
        const recipientSocketId = userSockets.get(data.receiverId);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('newMessage', message);
        }
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle message seen
    socket.on('messageSeen', async (data: { messageId: string }) => {
      try {
        const message = await prisma.message.findUnique({
          where: { id: data.messageId },
        });

        if (!message || message.receiverId !== socket.userId) {
          return;
        }

        const updatedMessage = await prisma.message.update({
          where: { id: data.messageId },
          data: {
            seen: true,
            seenAt: new Date(),
          },
        });

        // Notify sender
        const senderSocketId = userSockets.get(message.senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit('messageSeen', {
            messageId: data.messageId,
            seenAt: updatedMessage.seenAt,
          });
        }
      } catch (error) {
        console.error('Message seen error:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
      if (socket.userId) {
        userSockets.delete(socket.userId);
      }
    });
  });

  return io;
};
