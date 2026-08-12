import { Response, NextFunction } from 'express';
import { quotesService, QuotesService } from '../../server/services/quotes.service';
import { AuthRequest } from '../../server/middleware/auth';
import { quoteCreateSchema, quoteUpdateSchema } from '../../server/validation/quotes.validator';

export class QuotesController {
  constructor(private service: QuotesService) {}

  getAll = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.user?.tenant_id;
      if (!tenantId) {
        // This case should be caught by requireAuth middleware, but it's a safeguard.
        res.status(403).json({ success: false, error: { code: 'TENANT_REQUIRED', message: 'Tenant ID not found in session.' } });
        return;
      }
      const quotes = await this.service.getAllQuotes(tenantId);
      res.status(200).json({ success: true, data: quotes });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.user?.tenant_id;
      const { id } = req.params;
      if (!tenantId) {
        res.status(403).json({ success: false, error: { code: 'TENANT_REQUIRED', message: 'Tenant ID not found in session.' } });
        return;
      }
      const quote = await this.service.getQuoteById(id, tenantId);
      if (!quote) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Quote not found or not accessible.' } });
        return;
      }
      res.status(200).json({ success: true, data: quote });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.user?.tenant_id;
      const firebaseUid = req.user?.uid;
      if (!tenantId || !firebaseUid) {
        res.status(403).json({ success: false, error: { code: 'SESSION_INVALID', message: 'User or Tenant ID not found in session.' } });
        return;
      }
      const validatedData = quoteCreateSchema.parse(req.body);
      const newQuote = await this.service.createQuote({ ...validatedData, tenantId, firebaseUid });
      res.status(201).json({ success: true, data: newQuote });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.user?.tenant_id;
      const { id } = req.params;
      if (!tenantId) {
        res.status(403).json({ success: false, error: { code: 'TENANT_REQUIRED', message: 'Tenant ID not found in session.' } });
        return;
      }
      const validatedData = quoteUpdateSchema.parse(req.body);
      const updatedQuote = await this.service.updateQuote(id, tenantId, validatedData);
      res.status(200).json({ success: true, data: updatedQuote });
    } catch (error) {
      next(error);
    }
  };
}

export const quotesController = new QuotesController(quotesService);