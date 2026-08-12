import { Prisma, Lead } from '@prisma/client';
import { prisma } from '../lib/prisma';

export class LeadsRepository {
  async findAll(): Promise<Lead[]> {
    return prisma.lead.findMany({
      include: {
        client: { select: { id: true, name: true } },
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async create(data: Prisma.LeadCreateInput): Promise<Lead> {
    return prisma.lead.create({
      data,
    });
  }
}

/**
 * Singleton instance of the repository.
 */
export const leadsRepository = new LeadsRepository();