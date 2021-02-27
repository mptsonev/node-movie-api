import { NextFunction, Request, Response } from 'express';

export const authenticationCheckMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ error: 'No credentials sent!' });
  }
  next();
};
