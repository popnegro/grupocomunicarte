import { db } from '../../src/db';
import { quotes, NewQuote, Quote, leads } from '../../src/db/schema';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

type QuoteWithLead = Quote & {
  lead: typeof leads.$inferSelect | null;
};

export class QuotesRepository {
  async findAll(tenantId: string): Promise<QuoteWithLead[]> {
    return db.query.quotes.findMany({
      where: eq(quotes.tenantId, tenantId),
      with: {
        lead: true, // Correct Drizzle syntax for relations
      },
      orderBy: (quotes, { desc }) => [desc(quotes.createdAt)],
    });
  }

  async findById(id: string, tenantId: string): Promise<Quote | undefined> {
    return db.query.quotes.findFirst({
      where: and(eq(quotes.id, id), eq(quotes.tenantId, tenantId)),
    });
  }

  async create(data: Omit<NewQuote, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Quote> {
    const newRecord: NewQuote = {
      id: uuidv4(),
      status: 'REQUESTED',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    };
    const [inserted] = await db.insert(quotes).values(newRecord).returning();
    return inserted;
  }

  async update(id: string, tenantId: string, data: Partial<Omit<NewQuote, 'id' | 'tenantId'>>): Promise<Quote | undefined> {
    const [updated] = await db
      .update(quotes)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(quotes.id, id), eq(quotes.tenantId, tenantId)))
      .returning();
    return updated;
  }
}

/**
 * Singleton instance of the repository.
 */
export const quotesRepository = new QuotesRepository();