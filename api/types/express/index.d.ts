import { Request } from "express";
import pino from "pino";

declare global {
  namespace Express {
    interface Request {
      logger: pino.Logger,
    }
  }
}
