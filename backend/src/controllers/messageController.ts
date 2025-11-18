import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/db';
import { z } from 'zod';

const sendMessageSchema = z.object({
  receiverId: z.string(),
  content: z.string().min(1).max(1000),
});

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = sendMessageSchema.parse(req.body);
    
    // Check if users are blocked
    const isBlocked = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: req.userId, blockedId: validatedData.receiverId },
          { blockerId: validatedData.receiverId, blockedId: req.userId },
        ],
      },
    });
    
    if (isBlocked) {
      return res.status(403).json({ error: 'Cannot send message to this user' });
    }
    
    const message = await prisma.message.create({
      data: {
        senderId: req.userId!,
        receiverId: validatedData.receiverId,
        content: validatedData.content,
      },
    });
    
    res.status(201).json(message);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getConversation = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const before = req.query.before as string;
    
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.userId, receiverId: userId },
          { senderId: userId, receiverId: req.userId },
        ],
        ...(before && {
          createdAt: { lt: new Date(before) },
        }),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    
    res.json(messages.reverse());
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    // Get all unique conversation partners
    const sentMessages = await prisma.message.findMany({
      where: { senderId: req.userId },
      select: { receiverId: true },
      distinct: ['receiverId'],
    });
    
    const receivedMessages = await prisma.message.findMany({
      where: { receiverId: req.userId },
      select: { senderId: true },
      distinct: ['senderId'],
    });
    
    const partnerIds = [
      ...new Set([
        ...sentMessages.map(m => m.receiverId),
        ...receivedMessages.map(m => m.senderId),
      ]),
    ];
    
    // Get last message for each conversation
    const conversations = await Promise.all(
      partnerIds.map(async partnerId => {
        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: req.userId, receiverId: partnerId },
              { senderId: partnerId, receiverId: req.userId },
            ],
          },
          orderBy: { createdAt: 'desc' },
        });
        
        const unreadCount = await prisma.message.count({
          where: {
            senderId: partnerId,
            receiverId: req.userId,
            seen: false,
          },
        });
        
        const partner = await prisma.user.findUnique({
          where: { id: partnerId },
          include: { profile: true },
        });
        
        if (!partner) return null;
        
        const { password: _password, ...partnerWithoutPassword } = partner;
        
        return {
          partner: partnerWithoutPassword,
          lastMessage,
          unreadCount,
        };
      })
    );
    
    const validConversations = conversations
      .filter(c => c !== null)
      .sort((a, b) => {
        const dateA = a!.lastMessage?.createdAt || new Date(0);
        const dateB = b!.lastMessage?.createdAt || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
    
    res.json(validConversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const markMessageSeen = async (req: AuthRequest, res: Response) => {
  try {
    const { messageId } = req.params;
    
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    if (message.receiverId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: {
        seen: true,
        seenAt: new Date(),
      },
    });
    
    res.json(updatedMessage);
  } catch (error) {
    console.error('Mark message seen error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const markConversationSeen = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    
    await prisma.message.updateMany({
      where: {
        senderId: userId,
        receiverId: req.userId,
        seen: false,
      },
      data: {
        seen: true,
        seenAt: new Date(),
      },
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Mark conversation seen error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
