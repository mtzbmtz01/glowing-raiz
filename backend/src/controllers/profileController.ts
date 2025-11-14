import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, UpdateProfileInput, LocationUpdate } from '../types';

const prisma = new PrismaClient();

export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
      include: {
        photos: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    return res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: 'Failed to get profile' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            photos: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!user || !user.profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Check if blocked
    if (req.user) {
      const isBlocked = await prisma.block.findFirst({
        where: {
          OR: [
            { blockerId: req.user.id, blockedId: userId },
            { blockerId: userId, blockedId: req.user.id },
          ],
        },
      });

      if (isBlocked) {
        return res.status(403).json({ error: 'User not accessible' });
      }
    }

    return res.json({
      id: user.id,
      email: user.email,
      profile: user.profile,
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    return res.status(500).json({ error: 'Failed to get profile' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const updates: UpdateProfileInput = req.body;

    const profile = await prisma.profile.update({
      where: { userId: req.user.id },
      data: {
        ...(updates.displayName && { displayName: updates.displayName }),
        ...(updates.bio !== undefined && { bio: updates.bio }),
        ...(updates.age && { age: updates.age }),
        ...(updates.gender && { gender: updates.gender as any }),
        ...(updates.orientation && { orientation: updates.orientation as any }),
        ...(updates.interests && { interests: updates.interests }),
        ...(updates.searchRadius && { searchRadius: updates.searchRadius }),
        ...(updates.minAge && { minAge: updates.minAge }),
        ...(updates.maxAge && { maxAge: updates.maxAge }),
        ...(updates.genderPreference && { genderPreference: updates.genderPreference as any }),
      },
      include: {
        photos: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return res.json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const updateLocation = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { latitude, longitude }: LocationUpdate = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const profile = await prisma.profile.update({
      where: { userId: req.user.id },
      data: {
        latitude,
        longitude,
        locationUpdatedAt: new Date(),
      },
    });

    return res.json({ message: 'Location updated', profile });
  } catch (error) {
    console.error('Update location error:', error);
    return res.status(500).json({ error: 'Failed to update location' });
  }
};

export const uploadPhoto = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // TODO: Implement actual S3 upload with multer
    // This is a placeholder
    const { url, key, isProfile } = req.body;

    if (!url || !key) {
      return res.status(400).json({ error: 'URL and key required' });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Get current photo count for ordering
    const photoCount = await prisma.photo.count({
      where: { profileId: profile.id },
    });

    const photo = await prisma.photo.create({
      data: {
        profileId: profile.id,
        url,
        key,
        order: photoCount,
        isProfile: isProfile || false,
      },
    });

    return res.status(201).json(photo);
  } catch (error) {
    console.error('Upload photo error:', error);
    return res.status(500).json({ error: 'Failed to upload photo' });
  }
};

export const deletePhoto = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { photoId } = req.params;

    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: { profile: true },
    });

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    if (photo.profile.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this photo' });
    }

    // TODO: Delete from S3 using photo.key

    await prisma.photo.delete({
      where: { id: photoId },
    });

    return res.json({ message: 'Photo deleted' });
  } catch (error) {
    console.error('Delete photo error:', error);
    return res.status(500).json({ error: 'Failed to delete photo' });
  }
};
