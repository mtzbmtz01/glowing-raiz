import { Response } from 'express';
import { AuthRequest } from '../types';
import { BlockService } from '../services/blockService';

export class BlockController {
  static async blockUser(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      
      const { blockedId } = req.body;
      const block = await BlockService.blockUser(req.userId, blockedId);
      res.status(201).json(block);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
  
  static async unblockUser(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      
      const { blockedId } = req.params;
      await BlockService.unblockUser(req.userId, blockedId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
  
  static async getBlockedUsers(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      
      const blocks = await BlockService.getBlockedUsers(req.userId);
      res.json(blocks);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
