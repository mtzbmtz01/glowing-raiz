import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/db';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  bio: z.string().optional(),
  age: z.number().min(18).max(100).optional(),
  photos: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  preferredGender: z.array(z.enum(['MALE', 'FEMALE', 'OTHER'])).optional(),
  preferredMinAge: z.number().min(18).max(100).optional(),
  preferredMaxAge: z.number().min(18).max(100).optional(),
  preferredMaxDistance: z.number().min(1).max(500).optional(),
});

const updateLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.userId },
    });
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);
    
    const profile = await prisma.profile.update({
      where: { userId: req.userId },
      data: validatedData,
    });
    
    res.json(profile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateLocation = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = updateLocationSchema.parse(req.body);
    
    const profile = await prisma.profile.update({
      where: { userId: req.userId },
      data: {
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        locationUpdatedAt: new Date(),
      },
    });
    
    res.json(profile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Update location error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Check if user is blocked
    const isBlocked = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: req.userId, blockedId: userId },
          { blockerId: userId, blockedId: req.userId },
        ],
      },
    });
    
    if (isBlocked) {
      return res.status(403).json({ error: 'User not accessible' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });
    
    if (!user || user.status !== 'ACTIVE') {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
