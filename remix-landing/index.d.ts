import { UserSession } from "..";

// Use declaration merging to extend the Express Request interface
declare global {
  namespace Express {
    export interface Request {
      user?: UserSession;
    }
  }
}