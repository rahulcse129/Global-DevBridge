import { Router } from 'express';
import { createDecisionHandler, getAllDecisionsHandler, deleteDecisionHandler } from '../controllers/decision.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', createDecisionHandler);
router.get('/', getAllDecisionsHandler);
router.delete('/:id', deleteDecisionHandler);

export default router;
