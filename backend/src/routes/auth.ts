import express from 'express';
import * as authController from '../controllers/authController';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user with email and password
 */
router.post('/register', authController.register);

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post('/login', authController.login);

/**
 * POST /api/auth/apple
 * Login/Register with Apple
 */
router.post('/apple', authController.appleAuth);

/**
 * POST /api/auth/google
 * Login/Register with Google
 */
router.post('/google', authController.googleAuth);

export default router;
