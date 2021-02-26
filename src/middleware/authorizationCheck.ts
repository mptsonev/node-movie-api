import { Request, Response, NextFunction } from 'express';
import { verify, VerifyErrors } from 'jsonwebtoken';

export const authorizationCheckMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  verify(
    authHeader,
    process.env.JWT_SECRET,
    (err: VerifyErrors, decoded: any) => {
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
    }
  );
};
