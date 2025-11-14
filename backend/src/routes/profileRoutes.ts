import { Router } from 'express';
import { ProfileController } from '../controllers/profileController';
import { authMiddleware } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.put('/me', apiLimiter, authMiddleware, ProfileController.updateProfile);
router.get('/nearby', apiLimiter, authMiddleware, ProfileController.getNearbyUsers);
router.get('/:userId', apiLimiter, authMiddleware, ProfileController.getProfile);

export default router;
