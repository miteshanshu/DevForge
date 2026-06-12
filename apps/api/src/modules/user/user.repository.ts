import { prisma } from 'db';
import { Prisma } from '@prisma/client';

export class UserRepository {
  async getProfileByUsername(username: string) {
    return await prisma.user.findUnique({
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
  }

  async updateProfile(id: string, data: Prisma.UserUpdateInput) {
    return await prisma.user.update({
      where: { id },
      data,
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
  }

  async getTopDevelopers(skip: number, take: number) {
    return await prisma.user.findMany({
      skip,
      take,
      orderBy: { score: 'desc' },
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        skills: true,
        score: true,
      },
    });
  }
}

export const userRepository = new UserRepository();
