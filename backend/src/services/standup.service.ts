import prisma from '../utils/prisma';

export class StandupService {
  static async createStandup(userId: string, data: { didToday: string; doNext: string; blockers?: string }) {
    const { didToday, doNext, blockers } = data;
    
    return await prisma.standup.create({
      data: {
        userId,
        didToday,
        doNext,
        blockers,
      },
      include: {
        user: {
          select: { name: true, email: true, timezone: true }
        }
      }
    });
  }

  static async getAllStandups() {
    return await prisma.standup.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true, timezone: true }
        }
      }
    });
  }

  static async getStandupsByUser(userId: string) {
    return await prisma.standup.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getStandupById(id: string) {
    return await prisma.standup.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });
  }

  static async updateStandup(id: string, userId: string, data: { didToday?: string; doNext?: string; blockers?: string }) {
    // First ensure the standup exists and belongs to the user
    const standup = await prisma.standup.findUnique({ where: { id } });
    
    if (!standup) {
      throw new Error('Standup not found');
    }
    
    if (standup.userId !== userId) {
      throw new Error('Unauthorized to update this standup');
    }

    return await prisma.standup.update({
      where: { id },
      data,
    });
  }

  static async deleteStandup(id: string, userId: string) {
    const standup = await prisma.standup.findUnique({ where: { id } });
    
    if (!standup) {
      throw new Error('Standup not found');
    }
    
    if (standup.userId !== userId) {
      throw new Error('Unauthorized to delete this standup');
    }

    return await prisma.standup.delete({
      where: { id },
    });
  }
}
