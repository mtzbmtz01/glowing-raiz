import { Response } from 'express';
import { AuthRequest } from '../types';
import { MessageService } from '../services/messageService';

export class MessageController {
  static async sendMessage(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      
      const message = await MessageService.sendMessage(req.userId, req.body);
      res.status(201).json(message);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
  
  static async getConversation(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      
      const { otherUserId } = req.params;
      const messages = await MessageService.getConversation(req.userId, otherUserId);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  
  static async getConversations(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      
      const conversations = await MessageService.getConversations(req.userId);
      res.json(conversations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  
  static async markAsRead(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      
      const { messageId } = req.params;
      const message = await MessageService.markAsRead(req.userId, messageId);
      res.json(message);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
