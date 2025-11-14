import { PrismaClient } from '@prisma/client';
import { getDistance } from 'geolib';
import { ProfileUpdateData, NearbyFilters } from '../types';

const prisma = new PrismaClient();

export class ProfileService {
  static async updateProfile(userId: string, data: ProfileUpdateData) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    
    if (!user?.profile) {
      throw new Error('Profile not found');
    }
    
    const updateData: any = { ...data };
    
    if (data.birthDate) {
      updateData.birthDate = new Date(data.birthDate);
    }
    
    return await prisma.profile.update({
      where: { id: user.profile.id },
      data: updateData,
    });
  }
  
  static async getProfile(userId: string) {
    return await prisma.profile.findUnique({
      where: { userId },
    });
  }
  
  static async getNearbyUsers(userId: string, filters: NearbyFilters = {}) {
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    
    if (!currentUser?.profile) {
      throw new Error('Profile not found');
    }
    
    const { latitude, longitude, interestedIn, minAge, maxAge, maxDistance } = currentUser.profile;
    
    // Get blocked users
    const blocks = await prisma.block.findMany({
      where: {
        OR: [
          { blockerId: userId },
          { blockedId: userId },
        ],
      },
    });
    
    const blockedUserIds = blocks.map(b => 
      b.blockerId === userId ? b.blockedId : b.blockerId
    );
    
    // Calculate age range
    const today = new Date();
    const effectiveMinAge = filters.minAge || minAge;
    const effectiveMaxAge = filters.maxAge || maxAge;
    const maxBirthDate = new Date(today.getFullYear() - effectiveMinAge, today.getMonth(), today.getDate());
    const minBirthDate = new Date(today.getFullYear() - effectiveMaxAge - 1, today.getMonth(), today.getDate());
    
    // Get potential matches
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: userId,
          notIn: blockedUserIds,
        },
        profile: {
          isActive: true,
          birthDate: {
            gte: minBirthDate,
            lte: maxBirthDate,
          },
          ...(filters.gender ? { gender: filters.gender } : 
            interestedIn === 'both' ? {} : { gender: interestedIn }),
        },
      },
      include: {
        profile: true,
      },
      take: 100, // Limit results
    });
    
    // Filter by distance
    const effectiveMaxDistance = filters.maxDistance || maxDistance;
    const nearbyUsers = users
      .filter(u => {
        if (!u.profile) return false;
        
        const distance = getDistance(
          { latitude, longitude },
          { latitude: u.profile.latitude, longitude: u.profile.longitude }
        ) / 1000; // Convert to km
        
        return distance <= effectiveMaxDistance;
      })
      .map(u => ({
        ...u,
        distance: getDistance(
          { latitude, longitude },
          { latitude: u.profile!.latitude, longitude: u.profile!.longitude }
        ) / 1000,
      }))
      .sort((a, b) => a.distance - b.distance);
    
    return nearbyUsers;
  }
}
