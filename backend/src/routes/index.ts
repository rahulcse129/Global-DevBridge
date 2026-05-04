import { Router } from 'express';

const router = Router();

import authRoutes from './auth.routes';
import standupRoutes from './standup.routes';
import aiRoutes from './ai.routes';
import decisionRoutes from './decision.routes';

router.use('/auth', authRoutes);
router.use('/standups', standupRoutes);
router.use('/ai', aiRoutes);
router.use('/decisions', decisionRoutes);

export default router;
