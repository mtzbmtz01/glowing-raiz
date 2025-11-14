import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class BlockService {
  static async blockUser(blockerId: string, blockedId: string) {
    // Check if already blocked
    const existing = await prisma.block.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId,
          blockedId,
        },
      },
    });
    
    if (existing) {
      throw new Error('User already blocked');
    }
    
    return await prisma.block.create({
      data: {
        blockerId,
        blockedId,
      },
    });
  }
  
  static async unblockUser(blockerId: string, blockedId: string) {
    return await prisma.block.delete({
      where: {
        blockerId_blockedId: {
          blockerId,
          blockedId,
        },
      },
    });
  }
  
  static async getBlockedUsers(userId: string) {
    return await prisma.block.findMany({
      where: { blockerId: userId },
      include: {
        blocked: {
          include: { profile: true },
        },
      },
    });
  }
}
