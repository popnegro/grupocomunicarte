import { Prisma, Client } from '@prisma/client';
import { prisma } from '../lib/prisma';

export class ClientsRepository {
  async findAll(): Promise<Client[]> {
    return prisma.client.findMany();
  }

  async findById(id: string): Promise<Client | null> {
    return prisma.client.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.ClientCreateInput): Promise<Client> {
    return prisma.client.create({
      data,
    });
  }

  async update(id: string, data: Prisma.ClientUpdateInput): Promise<Client> {
    return prisma.client.update({
      where: { id },
      data,
    });
  }
}

/**
 * Singleton instance of the repository.
 * This pattern ensures that the same repository instance is used throughout the application,
 * which is efficient and consistent.
 */
export const clientsRepository = new ClientsRepository();