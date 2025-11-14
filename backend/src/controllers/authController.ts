import { Response } from 'express';
import { AuthRequest } from '../types';
import { AuthService } from '../services/authService';

export class AuthController {
  static async register(req: AuthRequest, res: Response) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
  
  static async login(req: AuthRequest, res: Response) {
    try {
      const result = await AuthService.login(req.body);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }
  
  static async getMe(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      
      const user = await AuthService.getUser(req.userId);
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
