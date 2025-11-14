import { Router } from 'express';
import { BlockController } from '../controllers/blockController';
import { authMiddleware } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/', apiLimiter, authMiddleware, BlockController.blockUser);
router.delete('/:blockedId', apiLimiter, authMiddleware, BlockController.unblockUser);
router.get('/', apiLimiter, authMiddleware, BlockController.getBlockedUsers);

export default router;
