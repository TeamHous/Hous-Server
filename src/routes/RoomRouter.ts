import { Router } from 'express';
import { body } from 'express-validator/check';
import { RuleController } from '../controllers';
import { RoomController } from '../controllers';
import auth from '../middleware/auth';

const router: Router = Router();

router.post(
  '/',
  [body('roomName').notEmpty()],
  auth,
  RoomController.createRoom
);
router.post(
  '/in',
  [body('roomCode').notEmpty()],
  auth,
  RoomController.joinRoom
);

router.post(
  '/:roomId/rules/category',
  [body('categoryName').not().isEmpty(), body('categoryIcon').not().isEmpty()],
  auth,
  RuleController.createRuleCategory
);

router.put(
  '/:roomId/rules/category/:categoryId',
  [body('categoryName').not().isEmpty(), body('categoryIcon').not().isEmpty()],
  auth,
  RuleController.updateRuleCategory
);

export default router;
