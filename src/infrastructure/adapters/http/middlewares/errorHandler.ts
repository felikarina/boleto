import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../../../../domain/errors/NotFoundError';
import { UnauthorizedError } from '../../../../domain/errors/UnauthorizedError';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof NotFoundError) {
    return res.status(404).json({ error: error.message });
  }

  if (error instanceof UnauthorizedError) {
    return res.status(403).json({ error: error.message });
  }

  console.error('Unhandled error:', error);
  return res.status(500).json({
    error: 'Erreur serveur interne.',
    ...(process.env.NODE_ENV !== 'production' && { details: error.message }),
  });
};