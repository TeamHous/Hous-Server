import { Router } from 'express';
import { body } from 'express-validator/check';
import {
  EventController,
  RoomController,
  RuleController
} from '../controllers';
import auth from '../middleware/auth';
import limitNum from '../modules/limitNum';

const router: Router = Router();

router.post('/', auth, RoomController.createRoom);
router.get(
  '/in',
  [body('roomCode').notEmpty()],
  auth,
  RoomController.getRoomAndUserByRoomCode
);
router.post(
  '/:roomId/in',
  [body('roomCode').notEmpty()],
  auth,
  RoomController.joinRoom
);

router.post(
  '/:roomId/rules/category',
  [
    body('categoryName').not().isEmpty(),
    body('categoryIcon').not().isEmpty(),
    body('categoryName').isLength({
      min: 1,
      max: limitNum.RULE_CATEGORY_NAME_MAX_LENGTH
    })
  ],
  auth,
  RuleController.createRuleCategory
);

router.put(
  '/:roomId/rules/category/:categoryId',
  [body('categoryName').not().isEmpty(), body('categoryIcon').not().isEmpty()],
  auth,
  RuleController.updateRuleCategory
);

/**
 * 이벤트
 */
router.post(
  '/:roomId/event',
  [
    body('eventName')
      .not()
      .isEmpty()
      .isLength({ min: 1, max: limitNum.EVENT_NAME_MAX_LENGTH }),
    body('eventIcon').not().isEmpty(),
    body('date').not().isEmpty(),
    body('participant').isArray()
  ],
  auth,
  EventController.createEvent
);

export default router;
