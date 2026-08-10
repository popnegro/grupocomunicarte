import { Router } from 'express';
import { db } from '../db/drizzle';
import { quotes, quoteStatusEnum, NewQuote } from '../db/schema/quotes';
import { leads } from '../db/schema/leads';
import { eq, and } from 'drizzle-orm';
import { authenticate, authorizeTenant } from '../middleware/auth'; // Assuming auth middleware exists
import { z } from 'zod';

const quotesRouter = Router();

// Zod schemas for validation
const quoteUpdateSchema = z.object({
  status: quoteStatusEnum.type.optional(),
  quotedPrice: z.number().positive().optional(),
  adminComments: z.string().optional(),
});

// GET /api/quotes - List all quotes for the authenticated tenant
quotesRouter.get('/', authenticate, authorizeTenant, async (req, res) => {
  try {
    const tenantId = req.tenantId; // From authorizeTenant middleware
    if (!tenantId) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Tenant ID not found.' } });
    }

    const allQuotes = await db.query.quotes.findMany({
      where: eq(quotes.tenantId, tenantId),
      with: {
        lead: true, // Include associated lead data
      },
      orderBy: (quotes, { desc }) => [desc(quotes.createdAt)],
    });

    return res.json({ success: true, data: allQuotes });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch quotes.' } });
  }
});

// GET /api/quotes/:id - Get a specific quote's details for the authenticated tenant
quotesRouter.get('/:id', authenticate, authorizeTenant, async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;

    if (!tenantId) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Tenant ID not found.' } });
    }

    const quote = await db.query.quotes.findFirst({
      where: and(eq(quotes.id, id), eq(quotes.tenantId, tenantId)),
      with: {
        lead: true, // Include associated lead data
      },
    });

    if (!quote) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Quote not found.' } });
    }

    // IMPORTANT: Only return pricing for authenticated/authorized users
    return res.json({ success: true, data: quote });
  } catch (error) {
    console.error('Error fetching quote details:', error);
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch quote details.' } });
  }
});

// PUT /api/quotes/:id - Update a quote (status, price, comments) for the authenticated tenant
quotesRouter.put('/:id', authenticate, authorizeTenant, async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;

    if (!tenantId) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Tenant ID not found.' } });
    }

    const parseResult = quoteUpdateSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: parseResult.error.errors[0].message } });
    }
    const { status, quotedPrice, adminComments } = parseResult.data;

    // Fetch current quote to validate transitions
    const currentQuote = await db.query.quotes.findFirst({
      where: and(eq(quotes.id, id), eq(quotes.tenantId, tenantId)),
    });

    if (!currentQuote) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Quote not found.' } });
    }

    // Implement state transition logic
    // REQUESTED -> QUOTED -> ACCEPTED
    // REQUESTED -> REJECTED
    // QUOTED -> REJECTED
    // QUOTED -> EXPIRED
    if (status) {
      const validTransition = (current: typeof quoteStatusEnum.enumValues[number], next: typeof quoteStatusEnum.enumValues[number]) => {
        switch (current) {
          case 'REQUESTED':
            return next === 'QUOTED' || next === 'REJECTED';
          case 'QUOTED':
            return next === 'ACCEPTED' || next === 'REJECTED' || next === 'EXPIRED';
          case 'ACCEPTED':
          case 'REJECTED':
          case 'EXPIRED':
            return false; // Terminal states
          default:
            return false;
        }
      };

      if (!validTransition(currentQuote.status, status)) {
        return res.status(400).json({ success: false, error: { code: 'INVALID_TRANSITION', message: `Cannot transition from ${currentQuote.status} to ${status}.` } });
      }
    }

    const [updatedQuote] = await db
      .update(quotes)
      .set({
        status,
        quotedPrice: quotedPrice !== undefined ? quotedPrice : currentQuote.quotedPrice, // Only update if provided
        adminComments: adminComments !== undefined ? adminComments : currentQuote.adminComments, // Only update if provided
        updatedAt: new Date(),
      })
      .where(and(eq(quotes.id, id), eq(quotes.tenantId, tenantId)))
      .returning();

    if (!updatedQuote) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Quote not found or not updated.' } });
    }

    return res.json({ success: true, data: updatedQuote });
  } catch (error) {
    console.error('Error updating quote:', error);
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to update quote.' } });
  }
});

export default quotesRouter;