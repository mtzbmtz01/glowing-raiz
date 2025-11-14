import { PrismaClient } from '@prisma/client';
import { MessageData } from '../types';

const prisma = new PrismaClient();

export class MessageService {
  static async sendMessage(senderId: string, data: MessageData) {
    const { receiverId, content } = data;
    
    // Check if users are blocked
    const block = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: senderId, blockedId: receiverId },
          { blockerId: receiverId, blockedId: senderId },
        ],
      },
    });
    
    if (block) {
      throw new Error('Cannot send message to blocked user');
    }
    
    return await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
      include: {
        sender: {
          include: { profile: true },
        },
      },
    });
  }
  
  static async getConversation(userId: string, otherUserId: string) {
    return await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        sender: {
          include: { profile: true },
        },
      },
    });
  }
  
  static async getConversations(userId: string) {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        sender: {
          include: { profile: true },
        },
        receiver: {
          include: { profile: true },
        },
      },
    });
    
    // Get unique conversations
    const conversationMap = new Map();
    
    messages.forEach(msg => {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          user: msg.senderId === userId ? msg.receiver : msg.sender,
          lastMessage: msg,
        });
      }
    });
    
    return Array.from(conversationMap.values());
  }
  
  static async markAsRead(userId: string, messageId: string) {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });
    
    if (!message || message.receiverId !== userId) {
      throw new Error('Message not found');
    }
    
    return await prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });
  }
}
