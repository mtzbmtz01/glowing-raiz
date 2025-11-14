import express from 'express';
import * as chatController from '../controllers/chatController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

/**
 * GET /api/chat/conversations
 * Get all conversations for current user
 */
router.get('/conversations', authenticate, chatController.getConversations);

/**
 * GET /api/chat/:userId
 * Get messages with a specific user
 */
router.get('/:userId', authenticate, chatController.getMessages);

/**
 * POST /api/chat
 * Send a message to a user
 */
router.post('/', authenticate, chatController.sendMessage);

export default router;
