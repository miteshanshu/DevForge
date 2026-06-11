import { Router } from 'express';
import { register, login, logout, me, refresh } from '../controllers/auth.controller';
import { githubOAuth, githubOAuthCallback, googleOAuth, googleOAuthCallback } from '../controllers/oauth.controller';
import { validate } from '../middleware/validate.middleware';
import { registerSchema, loginSchema } from '../schemas/auth.schemas';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Local Auth
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.post('/refresh', refresh);

// Session Check
router.get('/me', requireAuth, me);

// OAuth - GitHub
router.get('/github', githubOAuth);
router.get('/github/callback', githubOAuthCallback);

// OAuth - Google
router.get('/google', googleOAuth);
router.get('/google/callback', googleOAuthCallback);

export default router;
