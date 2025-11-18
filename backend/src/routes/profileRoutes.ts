import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  updateLocation,
  getUserProfile,
} from '../controllers/profileController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/me', authMiddleware, getProfile);
router.put('/me', authMiddleware, updateProfile);
router.put('/me/location', authMiddleware, updateLocation);
router.get('/:userId', authMiddleware, getUserProfile);

export default router;
