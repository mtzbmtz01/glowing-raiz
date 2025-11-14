import { Router } from 'express';
import {
  sendMessage,
  getConversation,
  getConversations,
  markMessageSeen,
  markConversationSeen,
} from '../controllers/messageController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, sendMessage);
router.get('/conversations', authMiddleware, getConversations);
router.get('/conversations/:userId', authMiddleware, getConversation);
router.put('/:messageId/seen', authMiddleware, markMessageSeen);
router.put('/conversations/:userId/seen', authMiddleware, markConversationSeen);

export default router;
