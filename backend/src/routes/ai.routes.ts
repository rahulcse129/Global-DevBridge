import { Router } from 'express';
import { indexStandupsHandler, generateSummaryHandler } from '../controllers/ai.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Protect AI routes
router.use(authenticate);

// Endpoint to trigger manual vector indexing (could be automated via cron)
router.post('/index', indexStandupsHandler);

// Endpoint to generate daily AI summary
router.get('/summary', generateSummaryHandler);

export default router;
