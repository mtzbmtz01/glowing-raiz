import { Router } from 'express';
import { ReportController } from '../controllers/reportController';
import { authMiddleware } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/', apiLimiter, authMiddleware, ReportController.createReport);
router.get('/', apiLimiter, authMiddleware, ReportController.getReports);

export default router;
