import { Router } from 'express';
import { getProfile, updateProfile, getDevelopers } from '../controllers/user.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateProfileSchema } from '../schemas/user.schemas';

const router = Router();

// Public routes
router.get('/', getDevelopers);
router.get('/:username', getProfile);

// Protected routes
router.put('/profile', requireAuth, validate(updateProfileSchema), updateProfile);

export default router;
