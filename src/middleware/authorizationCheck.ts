import { Request, Response, NextFunction } from 'express';
import { verify, VerifyErrors } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export const authorizationCheckMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  verify(authHeader, JWT_SECRET, (err: VerifyErrors, decoded: any) => {
    if (!!err) {
      return res.status(403).json({ error: 'Invalid Token!' });
    }
    const { role, name } = decoded;
    res.locals = {
      ...res.locals,
      role,
      name,
    };
    next();
  });
};
