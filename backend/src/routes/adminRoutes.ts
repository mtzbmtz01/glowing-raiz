import { Router } from 'express';
import {
  getAllUsers,
  suspendUser,
  activateUser,
  getAllReports,
  resolveReport,
  getStats,
} from '../controllers/adminController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Note: In production, add admin-only middleware
router.get('/users', authMiddleware, getAllUsers);
router.put('/users/:userId/suspend', authMiddleware, suspendUser);
router.put('/users/:userId/activate', authMiddleware, activateUser);
router.get('/reports', authMiddleware, getAllReports);
router.put('/reports/:reportId/resolve', authMiddleware, resolveReport);
router.get('/stats', authMiddleware, getStats);

export default router;
