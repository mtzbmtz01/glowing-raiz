import { Router } from 'express';
import { ReportController } from '../controllers/reportController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, ReportController.createReport);
router.get('/', authMiddleware, ReportController.getReports);

export default router;
