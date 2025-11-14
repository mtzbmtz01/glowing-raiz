import { Response } from 'express';
import { AuthRequest } from '../types';
import { ProfileService } from '../services/profileService';

export class ProfileController {
  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      
      const profile = await ProfileService.updateProfile(req.userId, req.body);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
  
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.params;
      const profile = await ProfileService.getProfile(userId);
      
      if (!profile) {
        res.status(404).json({ error: 'Profile not found' });
        return;
      }
      
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  
  static async getNearbyUsers(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      
      // Validate and sanitize gender filter against whitelist
      // This parameter is validated against a fixed list of allowed values
      const genderParam = req.query.gender as string | undefined;
      const validGenders = ['male', 'female', 'other'];
      const gender = genderParam && validGenders.includes(genderParam) 
        ? genderParam 
        : undefined;
      
      const filters = {
        maxDistance: req.query.maxDistance ? Number(req.query.maxDistance) : undefined,
        minAge: req.query.minAge ? Number(req.query.minAge) : undefined,
        maxAge: req.query.maxAge ? Number(req.query.maxAge) : undefined,
        gender,
      };
      
      const users = await ProfileService.getNearbyUsers(req.userId, filters);
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
