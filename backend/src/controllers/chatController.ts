import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, SendMessageInput } from '../types';

const prisma = new PrismaClient();

export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get all unique users that the current user has messaged with
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id },
          { receiverId: req.user.id },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        sender: {
          include: {
            profile: {
              include: {
                photos: {
                  where: { isProfile: true },
                  take: 1,
                },
              },
            },
          },
        },
        receiver: {
          include: {
            profile: {
              include: {
                photos: {
                  where: { isProfile: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    // Group by conversation partner
    const conversationMap = new Map();
    
    messages.forEach(message => {
      const otherUserId = message.senderId === req.user!.id 
        ? message.receiverId 
        : message.senderId;
      
      if (!conversationMap.has(otherUserId)) {
        const otherUser = message.senderId === req.user!.id 
          ? message.receiver 
          : message.sender;
        
        conversationMap.set(otherUserId, {
          user: {
            id: otherUser.id,
            email: otherUser.email,
            profile: otherUser.profile,
          },
          lastMessage: {
            id: message.id,
            content: message.content,
            senderId: message.senderId,
            receiverId: message.receiverId,
            isRead: message.isRead,
            createdAt: message.createdAt,
          },
          unreadCount: 0,
        });
      }
    });

    // Count unread messages
    for (const [userId, conversation] of conversationMap.entries()) {
      const unreadCount = await prisma.message.count({
        where: {
          senderId: userId,
          receiverId: req.user.id,
          isRead: false,
        },
      });
      conversation.unreadCount = unreadCount;
    }

    return res.json(Array.from(conversationMap.values()));
  } catch (error) {
    console.error('Get conversations error:', error);
    return res.status(500).json({ error: 'Failed to get conversations' });
  }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query as any;

    // Check if blocked
    const isBlocked = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: req.user.id, blockedId: userId },
          { blockerId: userId, blockedId: req.user.id },
        ],
      },
    });

    if (isBlocked) {
      return res.status(403).json({ error: 'Cannot message this user' });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id, receiverId: userId },
          { senderId: userId, receiverId: req.user.id },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        senderId: userId,
        receiverId: req.user.id,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return res.json(messages.reverse());
  } catch (error) {
    console.error('Get messages error:', error);
    return res.status(500).json({ error: 'Failed to get messages' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { receiverId, content }: SendMessageInput = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ error: 'Receiver ID and content required' });
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    // Check if blocked
    const isBlocked = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: req.user.id, blockedId: receiverId },
          { blockerId: receiverId, blockedId: req.user.id },
        ],
      },
    });

    if (isBlocked) {
      return res.status(403).json({ error: 'Cannot message this user' });
    }

    const message = await prisma.message.create({
      data: {
        senderId: req.user.id,
        receiverId,
        content,
      },
    });

    return res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
};
