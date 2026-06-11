import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.utils';

export interface AuthRequest extends Request {
  userId?: string;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const payload = verifyAccessToken(token);

  if (!payload) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }

  req.userId = payload.userId;
  next();
};
