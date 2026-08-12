import { Client, Prisma } from '@prisma/client';
import { clientsRepository, ClientsRepository } from '../repositories/clients.repository';
import { AppError } from '../lib/AppError';

export class ClientsService {
  constructor(private repository: ClientsRepository) {}

  async getAllClients(): Promise<Client[]> {
    return this.repository.findAll();
  }

  async getClientById(id: string): Promise<Client> {
    const client = await this.repository.findById(id);
    if (!client) {
      throw new AppError('Client not found', 404);
    }
    return client;
  }

  async createClient(data: Prisma.ClientCreateInput): Promise<Client> {
    if (!data.name || !data.contact) {
      throw new AppError('Name and contact are required', 400);
    }
    return this.repository.create(data);
  }

  async updateClient(id: string, data: Prisma.ClientUpdateInput): Promise<Client> {
    // First, ensure the client exists
    await this.getClientById(id);
    return this.repository.update(id, data);
  }
}

/**
 * Singleton instance of the service.
 * This pattern ensures that the same service instance is used throughout the application.
 * It's instantiated with the repository singleton to maintain the dependency chain.
 */
export const clientsService = new ClientsService(clientsRepository);