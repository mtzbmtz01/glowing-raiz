import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

// TODO: Implement proper admin role checking
const isAdmin = (req: AuthRequest): boolean => {
  // For now, this is a placeholder
  // In production, check if user has admin role
  return true;
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !isAdmin(req)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { limit = 50, offset = 0, status } = req.query as any;

    const where = status ? { status } : {};

    const users = await prisma.user.findMany({
      where,
      include: {
        profile: {
          include: {
            photos: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    const total = await prisma.user.count({ where });

    return res.json({
      users,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({ error: 'Failed to get users' });
  }
};

export const suspendUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !isAdmin(req)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { userId } = req.params;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { status: 'SUSPENDED' },
    });

    return res.json({ message: 'User suspended', user });
  } catch (error) {
    console.error('Suspend user error:', error);
    return res.status(500).json({ error: 'Failed to suspend user' });
  }
};

export const unsuspendUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !isAdmin(req)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { userId } = req.params;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { status: 'ACTIVE' },
    });

    return res.json({ message: 'User unsuspended', user });
  } catch (error) {
    console.error('Unsuspend user error:', error);
    return res.status(500).json({ error: 'Failed to unsuspend user' });
  }
};

export const getReports = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !isAdmin(req)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { resolved, limit = 50, offset = 0 } = req.query as any;

    const where = resolved !== undefined ? { resolved: resolved === 'true' } : {};

    const reports = await prisma.report.findMany({
      where,
      include: {
        reporter: {
          include: {
            profile: true,
          },
        },
        reported: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    const total = await prisma.report.count({ where });

    return res.json({
      reports,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Get reports error:', error);
    return res.status(500).json({ error: 'Failed to get reports' });
  }
};

export const resolveReport = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !isAdmin(req)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { reportId } = req.params;

    const report = await prisma.report.update({
      where: { id: reportId },
      data: {
        resolved: true,
        resolvedAt: new Date(),
      },
    });

    return res.json({ message: 'Report resolved', report });
  } catch (error) {
    console.error('Resolve report error:', error);
    return res.status(500).json({ error: 'Failed to resolve report' });
  }
};
