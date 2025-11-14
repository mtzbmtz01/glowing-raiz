import { Response } from 'express';
import { AuthRequest } from '../types';
import { ReportService } from '../services/reportService';

export class ReportController {
  static async createReport(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      
      const report = await ReportService.createReport(req.userId, req.body);
      res.status(201).json(report);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
  
  static async getReports(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      
      const reports = await ReportService.getReports(req.userId);
      res.json(reports);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
