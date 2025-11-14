import { Router } from 'express';
import {
  blockUser,
  unblockUser,
  getBlockedUsers,
  reportUser,
} from '../controllers/safetyController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/block/:userId', authMiddleware, blockUser);
router.delete('/block/:userId', authMiddleware, unblockUser);
router.get('/blocked', authMiddleware, getBlockedUsers);
router.post('/report', authMiddleware, reportUser);

export default router;
