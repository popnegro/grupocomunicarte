import { Quote, Prisma } from '@prisma/client';
import { quotesRepository, QuotesRepository } from '../repositories/quotes.repository';
import { AppError } from '../lib/AppError';

export class QuotesService {
  constructor(private repository: QuotesRepository) {}

  async getAllQuotes(): Promise<Quote[]> {
    return this.repository.findAll();
  }

  async createQuote(data: Prisma.QuoteCreateInput): Promise<Quote> {
    // Basic business validation
    if (!data.client || !data.total || !data.validUntil) {
      throw new AppError('Client, total, and validUntil are required', 400);
    }
    return this.repository.create(data);
  }
}

/**
 * Singleton instance of the service.
 */
export const quotesService = new QuotesService(quotesRepository);