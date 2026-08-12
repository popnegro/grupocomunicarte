import { Request, Response, NextFunction } from 'express';
import { clientsService, ClientsService } from '../services/clients.service';

export class ClientsController {
  constructor(private service: ClientsService) {}

  // Bind `this` to ensure `this.service` is available in the handlers
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const clients = await this.service.getAllClients();
      res.status(200).json(clients);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const client = await this.service.getClientById(id);
      res.status(200).json(client);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newClient = await this.service.createClient(req.body);
      res.status(201).json(newClient);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedClient = await this.service.updateClient(id, req.body);
      res.status(200).json(updatedClient);
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Singleton instance of the controller.
 * Instantiated with the service singleton.
 */
export const clientsController = new ClientsController(clientsService);