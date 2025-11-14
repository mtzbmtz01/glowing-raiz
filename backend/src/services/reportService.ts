import { PrismaClient } from '@prisma/client';
import { ReportData } from '../types';

const prisma = new PrismaClient();

export class ReportService {
  static async createReport(reporterId: string, data: ReportData) {
    const { reportedId, reason, details } = data;
    
    return await prisma.report.create({
      data: {
        reporterId,
        reportedId,
        reason,
        details,
      },
    });
  }
  
  static async getReports(userId: string) {
    return await prisma.report.findMany({
      where: { reporterId: userId },
      include: {
        reported: {
          include: { profile: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
