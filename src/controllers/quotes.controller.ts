import { Request, Response, NextFunction } from 'express';
import { quotesService, QuotesService } from '../services/quotes.service';
import { AppError } from '../middleware/errorHandler';

// Assuming AuthRequest is defined in server.ts or a shared middleware file
// For now, defining it here to avoid circular dependency if server.ts imports this controller
interface AuthUser {
  uid: string;
  tenant_id?: string;
}
interface AuthRequest extends Request { user?: AuthUser; auth?: { userId: string; }; }

export class QuotesController {
  constructor(private service: QuotesService) {}

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const quotes = await this.service.getAllQuotes();
      res.status(200).json(quotes);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenant_id } = (req as AuthRequest).user || {};
      // Apply the validated security pattern: userId MUST come from the authenticated session.
      const { userId } = (req as any).auth;
      if (!userId || !tenant_id) {
        throw new AppError('User not authenticated or session is invalid', 401);
      }
      // Ensure tenantId is present for the quote
      const finalTenantId = tenant_id;
      // The quotes schema has clientId and userId, but not tenantId.
      // However, the service layer expects tenantId for validation/scoping.

      // Explicitly ignore any userId that might be in the body to prevent tampering.
      const { userId: _, ...quoteData } = req.body;

      const newQuote = await this.service.createQuote({ ...quoteData, userId }, finalTenantId);
      res.status(201).json(newQuote);
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Singleton instance of the controller.
 */
export const quotesController = new QuotesController(quotesService);