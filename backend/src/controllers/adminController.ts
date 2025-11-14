import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/db';

// Note: In production, you'd want proper admin authentication
// This is a simplified version for demonstration

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        include: {
          profile: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);
    
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json({
      users: usersWithoutPasswords,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const suspendUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: { status: 'SUSPENDED' },
      include: { profile: true },
    });
    
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Suspend user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const activateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: { status: 'ACTIVE' },
      include: { profile: true },
    });
    
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Activate user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllReports = async (req: AuthRequest, res: Response) => {
  try {
    const resolved = req.query.resolved === 'true';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where: { resolved },
        include: {
          reporter: {
            include: { profile: true },
          },
          reported: {
            include: { profile: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.report.count({ where: { resolved } }),
    ]);
    
    res.json({
      reports,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get all reports error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const resolveReport = async (req: AuthRequest, res: Response) => {
  try {
    const { reportId } = req.params;
    
    const report = await prisma.report.update({
      where: { id: reportId },
      data: { resolved: true },
      include: {
        reporter: { include: { profile: true } },
        reported: { include: { profile: true } },
      },
    });
    
    res.json(report);
  } catch (error) {
    console.error('Resolve report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalMessages,
      openReports,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { status: 'SUSPENDED' } }),
      prisma.message.count(),
      prisma.report.count({ where: { resolved: false } }),
    ]);
    
    res.json({
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalMessages,
      openReports,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
