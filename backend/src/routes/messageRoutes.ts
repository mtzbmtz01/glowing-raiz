import { Router } from 'express';
import { MessageController } from '../controllers/messageController';
import { authMiddleware } from '../middleware/auth';
import { messageLimiter, apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/', messageLimiter, authMiddleware, MessageController.sendMessage);
router.get('/conversations', apiLimiter, authMiddleware, MessageController.getConversations);
router.get('/:otherUserId', apiLimiter, authMiddleware, MessageController.getConversation);
router.put('/:messageId/read', apiLimiter, authMiddleware, MessageController.markAsRead);

export default router;
