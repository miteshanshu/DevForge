import { Request, Response } from 'express';
import { userService } from './user.service';
import { AuthRequest } from '../../middleware/auth.middleware';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await userService.getProfile(req.params.username as string);
    return res.json({ user });
  } catch (error: any) {
    if (error.message === 'User not found') {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });
    const updatedUser = await userService.updateProfile(req.userId, req.body);
    return res.json({ user: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getDevelopers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const users = await userService.getDevelopers(page, limit);
    return res.json({ users });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
