import express from 'express';
import * as matchController from '../controllers/matchController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

/**
 * GET /api/match/nearby
 * Get nearby users based on location and preferences
 */
router.get('/nearby', authenticate, matchController.getNearbyUsers);

/**
 * POST /api/match
 * Create a match with another user
 */
router.post('/', authenticate, matchController.createMatch);

/**
 * GET /api/match
 * Get all matches for current user
 */
router.get('/', authenticate, matchController.getMatches);

/**
 * POST /api/match/block
 * Block a user
 */
router.post('/block', authenticate, matchController.blockUser);

/**
 * POST /api/match/report
 * Report a user
 */
router.post('/report', authenticate, matchController.reportUser);

export default router;
