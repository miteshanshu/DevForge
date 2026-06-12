import bcrypt from 'bcrypt';
import { authRepository } from './auth.repository';
import { generateTokens, verifyRefreshToken } from '../../utils/jwt.utils';

export class AuthService {
  async register(data: any) {
    const { email, username, password } = data;

    const existingUser = await authRepository.findUserByEmailOrUsername(email, username);
    if (existingUser) {
      throw new Error('Email or username already in use');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await authRepository.createUser({
      email,
      username,
      passwordHash,
    });

    const tokens = generateTokens(user.id, user.tokenVersion);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
      },
      tokens,
    };
  }

  async login(data: any) {
    const { email, password } = data;

    const user = await authRepository.findUserByEmail(email);

    if (!user || !user.passwordHash) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const tokens = generateTokens(user.id, user.tokenVersion);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
      },
      tokens,
    };
  }

  async refreshTokens(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new Error('Invalid refresh token');
    }

    const user = await authRepository.findUserById(payload.userId);
    if (!user || user.tokenVersion !== payload.tokenVersion) {
      throw new Error('Refresh token revoked');
    }

    return generateTokens(user.id, user.tokenVersion);
  }

  async oauthLogin(provider: 'github' | 'google', profile: any) {
    const email = profile.email;
    const providerId = profile.id;
    const name = profile.name;
    const loginUsername = profile.login || profile.email.split('@')[0];

    let user = await authRepository.findUserByEmail(email);

    if (user) {
      // Link account
      const updateData: any = {};
      if (provider === 'github' && !user.githubId) updateData.githubId = providerId;
      if (provider === 'google' && !user.googleId) updateData.googleId = providerId;
      
      if (Object.keys(updateData).length > 0) {
        user = await authRepository.updateUser(user.id, updateData);
      }
    } else {
      let username = loginUsername;
      const usernameExists = await authRepository.findUserByEmailOrUsername('', username);
      if (usernameExists) {
        username = `${username}_${Math.floor(Math.random() * 10000)}`;
      }

      user = await authRepository.createUser({
        email,
        username,
        name,
        [provider === 'github' ? 'githubId' : 'googleId']: providerId,
      });
    }

    return generateTokens(user.id, user.tokenVersion);
  }
}

export const authService = new AuthService();
