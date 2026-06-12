import { Request, Response } from 'express';
import { authService } from './auth.service';
import { authRepository } from './auth.repository';
import { AuthRequest } from '../../middleware/auth.middleware';

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.register(req.body);
    setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
    return res.status(201).json({ user: result.user });
  } catch (error: any) {
    if (error.message === 'Email or username already in use') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body);
    setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
    return res.json({ user: result.user });
  } catch (error: any) {
    if (error.message === 'Invalid credentials') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie('accessToken', { httpOnly: true, secure: isProd, sameSite: isProd ? 'none' : 'lax' });
  res.clearCookie('refreshToken', { httpOnly: true, secure: isProd, sameSite: isProd ? 'none' : 'lax' });
  return res.json({ message: 'Logged out successfully' });
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

    const tokens = await authService.refreshTokens(refreshToken);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    return res.json({ message: 'Tokens refreshed' });
  } catch (error: any) {
    return res.status(401).json({ message: error.message || 'Internal server error' });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });
    
    const user = await authRepository.findUserById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({
      user: {
        id: user.id, email: user.email, username: user.username,
        name: user.name, bio: user.bio, score: user.score
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// OAuth (GitHub)
export const githubOAuth = async (req: Request, res: Response) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `${process.env.BACKEND_URL || 'http://localhost:5000'}/auth/github/callback`;
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`);
};

export const githubOAuthCallback = async (req: Request, res: Response) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const { code } = req.query;
  
  if (!code) return res.redirect(`${frontendUrl}/login?error=no_code`);

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: process.env.GITHUB_CLIENT_ID, client_secret: process.env.GITHUB_CLIENT_SECRET, code }),
    });
    const { access_token } = await tokenRes.json();
    if (!access_token) return res.redirect(`${frontendUrl}/login?error=github_token_failed`);

    const userRes = await fetch('https://api.github.com/user', { headers: { Authorization: `Bearer ${access_token}` } });
    const userData = await userRes.json();

    const emailRes = await fetch('https://api.github.com/user/emails', { headers: { Authorization: `Bearer ${access_token}` } });
    const emails = await emailRes.json();
    const primaryEmail = emails.find((e: any) => e.primary && e.verified)?.email || emails[0]?.email;
    if (!primaryEmail) return res.redirect(`${frontendUrl}/login?error=no_email`);

    userData.email = primaryEmail;
    
    const tokens = await authService.oauthLogin('github', userData);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    res.redirect(`${frontendUrl}/`);
  } catch (error) {
    res.redirect(`${frontendUrl}/login?error=internal`);
  }
};

// OAuth (Google)
export const googleOAuth = async (req: Request, res: Response) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.BACKEND_URL || 'http://localhost:5000'}/auth/google/callback`;
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`);
};

export const googleOAuthCallback = async (req: Request, res: Response) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const redirectUri = `${process.env.BACKEND_URL || 'http://localhost:5000'}/auth/google/callback`;
  const { code } = req.query;

  if (!code) return res.redirect(`${frontendUrl}/login?error=no_code`);

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        code: code as string,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });
    const { access_token } = await tokenRes.json();
    if (!access_token) return res.redirect(`${frontendUrl}/login?error=google_token_failed`);

    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', { headers: { Authorization: `Bearer ${access_token}` } });
    const userData = await userRes.json();
    
    if (!userData.email || !userData.verified_email) return res.redirect(`${frontendUrl}/login?error=no_verified_email`);

    const tokens = await authService.oauthLogin('google', userData);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    res.redirect(`${frontendUrl}/`);
  } catch (error) {
    res.redirect(`${frontendUrl}/login?error=internal`);
  }
};
