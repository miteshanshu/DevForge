import { userRepository } from './user.repository';

export class UserService {
  async getProfile(username: string) {
    const user = await userRepository.getProfileByUsername(username);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateProfile(userId: string, data: any) {
    const { name, bio, location, skills, socialLinks } = data;

    const updatedUser = await userRepository.updateProfile(userId, {
      name,
      bio,
      location,
      skills: skills || [],
      socialLinks: socialLinks || {},
    });

    return updatedUser;
  }

  async getDevelopers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const users = await userRepository.getTopDevelopers(skip, limit);
    return users;
  }
}

export const userService = new UserService();
