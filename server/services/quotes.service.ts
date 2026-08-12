import { quotesRepository, QuotesRepository } from '../repositories/quotes.repository';
import { NewQuote, Quote, quoteStatusEnum, users } from '../../src/db/schema';
import { AppError } from '../middleware/errorHandler';
import { z } from 'zod';
import { quoteUpdateSchema } from '../validation/quotes.validator';
import { db } from '../../src/db';
import { eq } from 'drizzle-orm';

export class QuotesService {
  constructor(private repository: QuotesRepository) {}

  async getAllQuotes(tenantId: string): Promise<Quote[]> {
    return this.repository.findAll(tenantId);
  }

  async getQuoteById(id: string, tenantId: string): Promise<Quote | undefined> {
    return this.repository.findById(id, tenantId);
  }

  async createQuote(data: Omit<NewQuote, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'userId'> & { firebaseUid: string }): Promise<Quote> {
    if (!data.leadId || !data.firebaseUid || !data.tenantId) {
      throw new AppError('Lead, User, and Tenant are required to create a quote.', 400);
    }

    // Resolve Firebase UID to internal integer user ID
    const [user] = await db.select({ id: users.id }).from(users).where(eq(users.uid, data.firebaseUid)).limit(1);

    if (!user) {
      throw new AppError('Authenticated user not found in database.', 404);
    }

    const createData: Omit<NewQuote, 'id' | 'status' | 'createdAt' | 'updatedAt'> = {
      ...data,
      userId: user.id,
    };
    return this.repository.create(createData);
  }

  async updateQuote(id: string, tenantId: string, data: z.infer<typeof quoteUpdateSchema>): Promise<Quote> {
    const currentQuote = await this.repository.findById(id, tenantId);

    if (!currentQuote) {
      throw new AppError('Quote not found or not accessible.', 404);
    }

    // State machine validation
    if (data.status) {
      if (!this.isValidTransition(currentQuote.status, data.status)) {
        throw new AppError(`Invalid status transition from ${currentQuote.status} to ${data.status}.`, 400);
      }
    }

    const updatedQuote = await this.repository.update(id, tenantId, data);
    if (!updatedQuote) {
      // This should not happen if the findById check passed, but it's a safeguard.
      throw new AppError('Failed to update quote.', 500);
    }
    return updatedQuote;
  }

  private isValidTransition(current: typeof quoteStatusEnum.enumValues[number], next: typeof quoteStatusEnum.enumValues[number]): boolean {
    switch (current) {
      case 'REQUESTED':
        return ['QUOTED', 'REJECTED'].includes(next);
      case 'QUOTED':
        return ['ACCEPTED', 'REJECTED', 'EXPIRED'].includes(next);
      case 'ACCEPTED':
      case 'REJECTED':
      case 'EXPIRED':
        return false; // Terminal states
      default:
        return false;
    }
  }
}

export const quotesService = new QuotesService(quotesRepository);
