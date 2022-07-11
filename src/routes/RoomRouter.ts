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

/**
 * 방
 */
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

/**
 * 규칙
 */
router.post(
  '/:roomId/rule',
  [
    body('notificationState').isBoolean(),
    body('ruleName').isLength({
      min: 1,
      max: limitNum.RULE_NAME_MAX_LENGTH
    }),
    body('categoryId').not().isEmpty(),
    body('isKeyRules').isBoolean(),
    body('ruleMembers').isArray()
  ],
  auth,
  RuleController.createRule
);
router.get('/:roomId/rule/new', auth, RuleController.getRuleCreateInfo);
router.get('/:roomId/rule/:ruleId', auth, RuleController.getRuleByRuleId);
router.put(
  '/:roomId/rule/:ruleId',
  [
    body('notificationState').isBoolean(),
    body('ruleName').isLength({
      min: 1,
      max: limitNum.RULE_NAME_MAX_LENGTH
    }),
    body('categoryId').not().isEmpty(),
    body('isKeyRules').isBoolean(),
    body('ruleMembers').isArray()
  ],
  auth,
  RuleController.updateRule
);
router.delete('/:roomId/rule/:ruleId', auth, RuleController.deleteRule);

/**
 * 규칙 카테고리
 */
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
    body('participants').isArray()
  ],
  auth,
  EventController.createEvent
);
router.put(
  '/:roomId/event/:eventId',
  [
    body('eventName')
      .not()
      .isEmpty()
      .isLength({ min: 1, max: limitNum.EVENT_NAME_MAX_LENGTH }),
    body('eventIcon').not().isEmpty(),
    body('date').not().isEmpty(),
    body('participants').not().isEmpty().isArray()
  ],
  auth,
  EventController.updateEvent
);
router.delete('/:roomId/event/:eventId', auth, EventController.deleteEvent);

export default router;
