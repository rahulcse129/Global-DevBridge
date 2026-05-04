import { Router } from 'express';
import { 
  createStandupHandler, 
  getAllStandupsHandler, 
  getMyStandupsHandler,
  updateStandupHandler,
  deleteStandupHandler
} from '../controllers/standup.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Protect all standup routes
router.use(authenticate);

router.post('/', createStandupHandler);
router.get('/', getAllStandupsHandler);
router.get('/me', getMyStandupsHandler);
router.put('/:id', updateStandupHandler);
router.delete('/:id', deleteStandupHandler);

export default router;
