import { Router } from 'express';
import { BlockController } from '../controllers/blockController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, BlockController.blockUser);
router.delete('/:blockedId', authMiddleware, BlockController.unblockUser);
router.get('/', authMiddleware, BlockController.getBlockedUsers);

export default router;
