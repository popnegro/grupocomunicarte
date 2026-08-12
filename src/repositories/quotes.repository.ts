import { Prisma, Quote } from '@prisma/client';
import { prisma } from '../lib/prisma';

export class QuotesRepository {
  async findAll(): Promise<Quote[]> {
    return prisma.quote.findMany({
      include: {
        client: { select: { id: true, name: true } },
      },
    });
  }

  async create(data: Prisma.QuoteCreateInput): Promise<Quote> {
    return prisma.quote.create({
      data,
    });
  }
}

/**
 * Singleton instance of the repository.
 */
export const quotesRepository = new QuotesRepository();