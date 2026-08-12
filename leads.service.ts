import { Lead, Prisma } from '@prisma/client';
import { leadsRepository, LeadsRepository } from '../repositories/leads.repository';
import { AppError } from '../lib/AppError';

export class LeadsService {
  constructor(private repository: LeadsRepository) {}

  async getAllLeads(): Promise<Lead[]> {
    return this.repository.findAll();
  }

  async createLead(data: Prisma.LeadCreateInput): Promise<Lead> {
    // Basic business validation
    if (!data.client) {
      throw new AppError('Client and User are required to create a lead', 400);
    }
    return this.repository.create(data);
  }
}

/**
 * Singleton instance of the service.
 * It's instantiated with the repository singleton to maintain the dependency chain.
 */
export const leadsService = new LeadsService(leadsRepository);