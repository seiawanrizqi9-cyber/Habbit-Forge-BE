import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      startTime?: number;
      apikey?: string;
      user?: {
        id: string;
        email?: string;
        username?: string;
      };
      
      habitId?: string;
      checkInId?: string;
      habit?: {
        id: string;
        userId: string;
        title: string;
        isActive: boolean;
      };
    }
  }
}