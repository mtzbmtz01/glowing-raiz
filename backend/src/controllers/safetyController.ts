import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/db';
import { z } from 'zod';

const reportSchema = z.object({
  reportedId: z.string(),
  reason: z.enum([
    'INAPPROPRIATE_CONTENT',
    'HARASSMENT',
    'SPAM',
    'FAKE_PROFILE',
    'UNDERAGE',
    'OTHER',
  ]),
  description: z.string().optional(),
});

export const blockUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    
    if (userId === req.userId) {
      return res.status(400).json({ error: 'Cannot block yourself' });
    }
    
    // Check if already blocked
    const existingBlock = await prisma.block.findFirst({
      where: {
        blockerId: req.userId,
        blockedId: userId,
      },
    });
    
    if (existingBlock) {
      return res.status(400).json({ error: 'User already blocked' });
    }
    
    const block = await prisma.block.create({
      data: {
        blockerId: req.userId!,
        blockedId: userId,
      },
    });
    
    res.status(201).json(block);
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const unblockUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    
    const block = await prisma.block.findFirst({
      where: {
        blockerId: req.userId,
        blockedId: userId,
      },
    });
    
    if (!block) {
      return res.status(404).json({ error: 'Block not found' });
    }
    
    await prisma.block.delete({
      where: { id: block.id },
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Unblock user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBlockedUsers = async (req: AuthRequest, res: Response) => {
  try {
    const blocks = await prisma.block.findMany({
      where: { blockerId: req.userId },
      include: {
        blocked: {
          include: {
            profile: true,
          },
        },
      },
    });
    
    const blockedUsers = blocks.map(block => {
      const { password, ...userWithoutPassword } = block.blocked;
      return userWithoutPassword;
    });
    
    res.json(blockedUsers);
  } catch (error) {
    console.error('Get blocked users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const reportUser = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = reportSchema.parse(req.body);
    
    if (validatedData.reportedId === req.userId) {
      return res.status(400).json({ error: 'Cannot report yourself' });
    }
    
    const report = await prisma.report.create({
      data: {
        reporterId: req.userId!,
        reportedId: validatedData.reportedId,
        reason: validatedData.reason,
        description: validatedData.description,
      },
    });
    
    res.status(201).json(report);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Report user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
