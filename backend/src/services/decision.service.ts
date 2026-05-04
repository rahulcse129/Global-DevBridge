import prisma from '../utils/prisma';

export class DecisionService {
  static async createDecision(data: { problem: string; options: string; finalDecision: string }) {
    return prisma.decision.create({
      data: {
        problem: data.problem,
        options: data.options,
        finalDecision: data.finalDecision,
      }
    });
  }

  static async getAllDecisions() {
    return prisma.decision.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  static async deleteDecision(id: string) {
    return prisma.decision.delete({
      where: { id }
    });
  }
}
