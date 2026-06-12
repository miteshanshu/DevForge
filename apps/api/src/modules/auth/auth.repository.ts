import { prisma } from 'db';
import { Prisma } from '@prisma/client';

export class AuthRepository {
  async findUserByEmailOrUsername(email: string, username: string) {
    return await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
  }

  async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data,
    });
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }
}

export const authRepository = new AuthRepository();
