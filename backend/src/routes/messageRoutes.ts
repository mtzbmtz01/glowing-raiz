import { Router } from 'express';
import { MessageController } from '../controllers/messageController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, MessageController.sendMessage);
router.get('/conversations', authMiddleware, MessageController.getConversations);
router.get('/:otherUserId', authMiddleware, MessageController.getConversation);
router.put('/:messageId/read', authMiddleware, MessageController.markAsRead);

export default router;
