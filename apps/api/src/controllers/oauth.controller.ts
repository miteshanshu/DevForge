import { Request, Response } from 'express';
import { prisma } from 'db';
import { generateTokens } from '../utils/jwt.utils';

// Helper to set cookies (can be moved to a shared util later)
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

export const githubOAuth = async (req: Request, res: Response) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `${process.env.BACKEND_URL || 'http://localhost:5000'}/auth/github/callback`;
  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
  res.redirect(url);
};

export const githubOAuthCallback = async (req: Request, res: Response) => {
  const { code } = req.query;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  if (!code) {
    return res.redirect(`${frontendUrl}/login?error=no_code`);
  }

  try {
    // 1. Get access token from GitHub
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return res.redirect(`${frontendUrl}/login?error=github_token_failed`);
    }

    // 2. Get user profile
    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userData = await userRes.json();

    // 3. Get user emails (since email might be private)
    const emailRes = await fetch('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const emails = await emailRes.json();
    const primaryEmail = emails.find((e: any) => e.primary && e.verified)?.email || emails[0]?.email;

    if (!primaryEmail) {
      return res.redirect(`${frontendUrl}/login?error=no_email`);
    }

    // 4. Find or create user
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ githubId: userData.id.toString() }, { email: primaryEmail }],
      },
    });

    if (user) {
      // Link GitHub if matching by email
      if (!user.githubId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { githubId: userData.id.toString() },
        });
      }
    } else {
      // Create new user
      // Generate a unique username if the github username is taken
      let username = userData.login;
      const usernameExists = await prisma.user.findUnique({ where: { username } });
      if (usernameExists) {
        username = `${username}_${Math.floor(Math.random() * 10000)}`;
      }

      user = await prisma.user.create({
        data: {
          email: primaryEmail,
          username,
          githubId: userData.id.toString(),
          name: userData.name || userData.login,
          avatar: undefined, // Setup media relation later or store url temporarily
        },
      });
    }

    const tokens = generateTokens(user.id, user.tokenVersion);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    res.redirect(`${frontendUrl}/`);
  } catch (error) {
    console.error('GitHub OAuth Error:', error);
    res.redirect(`${frontendUrl}/login?error=internal`);
  }
};

export const googleOAuth = async (req: Request, res: Response) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.BACKEND_URL || 'http://localhost:5000'}/auth/google/callback`;
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`;
  res.redirect(url);
};

export const googleOAuthCallback = async (req: Request, res: Response) => {
  const { code } = req.query;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${process.env.BACKEND_URL || 'http://localhost:5000'}/auth/google/callback`;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  if (!code) {
    return res.redirect(`${frontendUrl}/login?error=no_code`);
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId as string,
        client_secret: clientSecret as string,
        code: code as string,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return res.redirect(`${frontendUrl}/login?error=google_token_failed`);
    }

    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userRes.json();

    if (!userData.email || !userData.verified_email) {
      return res.redirect(`${frontendUrl}/login?error=no_verified_email`);
    }

    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId: userData.id }, { email: userData.email }],
      },
    });

    if (user) {
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId: userData.id },
        });
      }
    } else {
      let username = userData.email.split('@')[0];
      const usernameExists = await prisma.user.findUnique({ where: { username } });
      if (usernameExists) {
        username = `${username}_${Math.floor(Math.random() * 10000)}`;
      }

      user = await prisma.user.create({
        data: {
          email: userData.email,
          username,
          googleId: userData.id,
          name: userData.name,
        },
      });
    }

    const tokens = generateTokens(user.id, user.tokenVersion);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    res.redirect(`${frontendUrl}/`);
  } catch (error) {
    console.error('Google OAuth Error:', error);
    res.redirect(`${frontendUrl}/login?error=internal`);
  }
};
