import { Router } from 'express';
import { body } from 'express-validator/check';
import { RoomController, RuleController } from '../controllers';
import auth from '../middleware/auth';

const router: Router = Router();

router.post(
  '/',
  [body('roomName').notEmpty()],
  auth,
  RoomController.createRoom
);
router.get(
  '/in',
  [body('roomCode').notEmpty()],
  auth,
  RoomController.getRoomByRoomCode
);
router.post(
  '/:roomId/in',
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
