import { Request, Response } from 'express';
import { prisma } from 'db';
import { AuthRequest } from '../middleware/auth.middleware';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const username = req.params.username as string;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        location: true,
        skills: true,
        socialLinks: true,
        score: true,
        createdAt: true,
        // Relations
        projects: {
          select: { id: true, title: true, slug: true, description: true, tags: true },
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        buildLogs: {
          select: { id: true, content: true, status: true, createdAt: true },
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });

    const { name, bio, location, skills, socialLinks } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: {
        name,
        bio,
        location,
        skills: skills || [],
        socialLinks: socialLinks || {},
      },
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        location: true,
        skills: true,
        socialLinks: true,
        score: true,
      },
    });

    return res.json({ user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getDevelopers = async (req: Request, res: Response) => {
  try {
    // Basic pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { score: 'desc' }, // Top contributors first
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        skills: true,
        score: true,
      },
    });

    return res.json({ users });
  } catch (error) {
    console.error('Get developers error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
