import express from 'express';
import * as adminController from '../controllers/adminController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

/**
 * GET /api/admin/users
 * Get all users (admin only)
 */
router.get('/users', authenticate, adminController.getUsers);

/**
 * PUT /api/admin/users/:userId/suspend
 * Suspend a user (admin only)
 */
router.put('/users/:userId/suspend', authenticate, adminController.suspendUser);

/**
 * PUT /api/admin/users/:userId/unsuspend
 * Unsuspend a user (admin only)
 */
router.put('/users/:userId/unsuspend', authenticate, adminController.unsuspendUser);

/**
 * GET /api/admin/reports
 * Get all reports (admin only)
 */
router.get('/reports', authenticate, adminController.getReports);

/**
 * PUT /api/admin/reports/:reportId/resolve
 * Resolve a report (admin only)
 */
router.put('/reports/:reportId/resolve', authenticate, adminController.resolveReport);

export default router;
