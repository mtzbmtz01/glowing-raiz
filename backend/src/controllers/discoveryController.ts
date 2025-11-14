import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/db';
import { calculateDistance } from '../utils/distance';

export const getNearbyUsers = async (req: AuthRequest, res: Response) => {
  try {
    // Get current user's profile with preferences
    const myProfile = await prisma.profile.findUnique({
      where: { userId: req.userId },
    });
    
    if (!myProfile || !myProfile.latitude || !myProfile.longitude) {
      return res.status(400).json({ 
        error: 'Location not set. Please update your location first.' 
      });
    }
    
    // Get blocked users
    const blocks = await prisma.block.findMany({
      where: {
        OR: [
          { blockerId: req.userId },
          { blockedId: req.userId },
        ],
      },
    });
    
    const blockedUserIds = blocks.map(block =>
      block.blockerId === req.userId ? block.blockedId : block.blockerId
    );
    
    // Get all users with profiles within a reasonable area
    const users = await prisma.user.findMany({
      where: {
        id: { not: req.userId, notIn: blockedUserIds },
        status: 'ACTIVE',
        profile: {
          latitude: { not: null },
          longitude: { not: null },
          gender: { in: myProfile.preferredGender },
          age: {
            gte: myProfile.preferredMinAge,
            lte: myProfile.preferredMaxAge,
          },
        },
      },
      include: {
        profile: true,
      },
      take: 100, // Limit initial fetch
    });
    
    // Calculate distance and filter
    const nearbyUsers = users
      .map(user => {
        const distance = calculateDistance(
          myProfile.latitude!,
          myProfile.longitude!,
          user.profile!.latitude!,
          user.profile!.longitude!
        );
        
        return { user, distance };
      })
      .filter(item => item.distance <= myProfile.preferredMaxDistance)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 50) // Return top 50 closest users
      .map(item => {
        const { password, ...userWithoutPassword } = item.user;
        return {
          ...userWithoutPassword,
          distance: Math.round(item.distance * 10) / 10, // Round to 1 decimal
        };
      });
    
    res.json(nearbyUsers);
  } catch (error) {
    console.error('Get nearby users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
