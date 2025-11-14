import { Router } from 'express';
import { ProfileController } from '../controllers/profileController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.put('/me', authMiddleware, ProfileController.updateProfile);
router.get('/nearby', authMiddleware, ProfileController.getNearbyUsers);
router.get('/:userId', authMiddleware, ProfileController.getProfile);

export default router;
