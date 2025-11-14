import express from 'express';
import * as profileController from '../controllers/profileController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

/**
 * GET /api/profile/me
 * Get current user's profile
 */
router.get('/me', authenticate, profileController.getMyProfile);

/**
 * GET /api/profile/:userId
 * Get a user's profile by ID
 */
router.get('/:userId', authenticate, profileController.getProfile);

/**
 * PUT /api/profile
 * Update current user's profile
 */
router.put('/', authenticate, profileController.updateProfile);

/**
 * PUT /api/profile/location
 * Update current user's location
 */
router.put('/location', authenticate, profileController.updateLocation);

/**
 * POST /api/profile/photos
 * Upload a photo
 */
router.post('/photos', authenticate, profileController.uploadPhoto);

/**
 * DELETE /api/profile/photos/:photoId
 * Delete a photo
 */
router.delete('/photos/:photoId', authenticate, profileController.deletePhoto);

export default router;
