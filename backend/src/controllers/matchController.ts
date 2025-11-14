import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, NearbyUsersQuery } from '../types';
import { calculateDistance } from '../utils/distance';

const prisma = new PrismaClient();

export const getNearbyUsers = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const myProfile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
    });

    if (!myProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (!myProfile.latitude || !myProfile.longitude) {
      return res.status(400).json({ error: 'Location not set. Please update your location.' });
    }

    const {
      radius = myProfile.searchRadius,
      minAge = myProfile.minAge,
      maxAge = myProfile.maxAge,
      limit = 50,
      offset = 0,
    } = req.query as any;

    // Get blocked users
    const blocks = await prisma.block.findMany({
      where: {
        OR: [
          { blockerId: req.user.id },
          { blockedId: req.user.id },
        ],
      },
    });

    const blockedUserIds = blocks.map(block =>
      block.blockerId === req.user.id ? block.blockedId : block.blockerId
    );

    // Find nearby users
    const profiles = await prisma.profile.findMany({
      where: {
        userId: {
          not: req.user.id,
          notIn: blockedUserIds,
        },
        latitude: { not: null },
        longitude: { not: null },
        age: {
          gte: minAge,
          lte: maxAge,
        },
        ...(myProfile.genderPreference.length > 0 && {
          gender: { in: myProfile.genderPreference },
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            lastActiveAt: true,
          },
        },
        photos: {
          orderBy: { order: 'asc' },
        },
      },
    });

    // Calculate distances and filter by radius
    const usersWithDistance = profiles
      .map(profile => {
        const distance = calculateDistance(
          myProfile.latitude!,
          myProfile.longitude!,
          profile.latitude!,
          profile.longitude!
        );
        return {
          ...profile,
          distance,
        };
      })
      .filter(profile => profile.distance <= radius)
      .sort((a, b) => a.distance - b.distance)
      .slice(offset, offset + limit);

    return res.json({
      users: usersWithDistance.map(profile => ({
        id: profile.user.id,
        email: profile.user.email,
        lastActiveAt: profile.user.lastActiveAt,
        profile: {
          displayName: profile.displayName,
          bio: profile.bio,
          age: profile.age,
          gender: profile.gender,
          orientation: profile.orientation,
          interests: profile.interests,
          photos: profile.photos,
        },
        distance: Math.round(profile.distance * 10) / 10, // Round to 1 decimal
      })),
      total: usersWithDistance.length,
    });
  } catch (error) {
    console.error('Get nearby users error:', error);
    return res.status(500).json({ error: 'Failed to get nearby users' });
  }
};

export const createMatch = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    // Check if already matched
    const existingMatch = await prisma.match.findFirst({
      where: {
        OR: [
          { initiatorId: req.user.id, receiverId: userId },
          { initiatorId: userId, receiverId: req.user.id },
        ],
      },
    });

    if (existingMatch) {
      return res.status(400).json({ error: 'Already matched with this user' });
    }

    // Check if blocked
    const isBlocked = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: req.user.id, blockedId: userId },
          { blockerId: userId, blockedId: req.user.id },
        ],
      },
    });

    if (isBlocked) {
      return res.status(403).json({ error: 'Cannot match with this user' });
    }

    const match = await prisma.match.create({
      data: {
        initiatorId: req.user.id,
        receiverId: userId,
      },
    });

    return res.status(201).json(match);
  } catch (error) {
    console.error('Create match error:', error);
    return res.status(500).json({ error: 'Failed to create match' });
  }
};

export const getMatches = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { initiatorId: req.user.id },
          { receiverId: req.user.id },
        ],
      },
      include: {
        initiator: {
          include: {
            profile: {
              include: {
                photos: true,
              },
            },
          },
        },
        receiver: {
          include: {
            profile: {
              include: {
                photos: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const matchedUsers = matches.map(match => {
      const otherUser = match.initiatorId === req.user!.id ? match.receiver : match.initiator;
      return {
        id: otherUser.id,
        email: otherUser.email,
        profile: otherUser.profile,
        matchedAt: match.createdAt,
      };
    });

    return res.json(matchedUsers);
  } catch (error) {
    console.error('Get matches error:', error);
    return res.status(500).json({ error: 'Failed to get matches' });
  }
};

export const blockUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot block yourself' });
    }

    // Check if already blocked
    const existingBlock = await prisma.block.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId: req.user.id,
          blockedId: userId,
        },
      },
    });

    if (existingBlock) {
      return res.status(400).json({ error: 'User already blocked' });
    }

    const block = await prisma.block.create({
      data: {
        blockerId: req.user.id,
        blockedId: userId,
      },
    });

    // Delete any existing matches
    await prisma.match.deleteMany({
      where: {
        OR: [
          { initiatorId: req.user.id, receiverId: userId },
          { initiatorId: userId, receiverId: req.user.id },
        ],
      },
    });

    return res.status(201).json({ message: 'User blocked', block });
  } catch (error) {
    console.error('Block user error:', error);
    return res.status(500).json({ error: 'Failed to block user' });
  }
};

export const reportUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId, reason } = req.body;

    if (!userId || !reason) {
      return res.status(400).json({ error: 'User ID and reason required' });
    }

    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot report yourself' });
    }

    const report = await prisma.report.create({
      data: {
        reporterId: req.user.id,
        reportedId: userId,
        reason,
      },
    });

    return res.status(201).json({ message: 'User reported', report });
  } catch (error) {
    console.error('Report user error:', error);
    return res.status(500).json({ error: 'Failed to report user' });
  }
};
