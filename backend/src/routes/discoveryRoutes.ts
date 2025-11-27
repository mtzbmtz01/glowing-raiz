import { Router } from 'express';
import { getNearbyUsers } from '../controllers/discoveryController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/nearby', authMiddleware, getNearbyUsers);

export default router;
