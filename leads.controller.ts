import { Request, Response, NextFunction } from 'express';
import { leadsService, LeadsService } from '../services/leads.service';
import { AppError } from '../lib/AppError';

export class LeadsController {
  constructor(private service: LeadsService) {}

  // Bind `this` to ensure `this.service` is available in the handlers
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const leads = await this.service.getAllLeads();
      res.status(200).json(leads);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // SECURITY FIX: The userId MUST come from the authenticated session, not the request body.
      const { userId } = (req as any).auth;
      if (!userId) {
        // This case should ideally be caught by the auth middleware, but it's a good safeguard.
        throw new AppError('User not authenticated or session is invalid', 401);
      }

      // Explicitly ignore any userId that might be in the body to prevent tampering.
      const { userId: _, ...leadData } = req.body;

      const newLead = await this.service.createLead({ ...leadData, user: { connect: { id: userId } } });
      res.status(201).json(newLead);
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Singleton instance of the controller.
 * Instantiated with the service singleton.
 */
export const leadsController = new LeadsController(leadsService);