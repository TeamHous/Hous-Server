import { Router } from 'express';
import { body } from 'express-validator/check';
import { RuleController } from '../controllers';
import { RoomController } from '../controllers';
import auth from '../middleware/auth';

const router: Router = Router();

router.post('/', auth, RoomController.createRoom);

router.post(
  '/:roomId/rules/category',
  [body('categoryName').not().isEmpty(), body('categoryIcon').not().isEmpty()],
  auth,
  RuleController.createRuleCategory
);

export default router;
