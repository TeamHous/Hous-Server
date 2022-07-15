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
 * 룸
 */
router.get('/', auth, RoomController.getRoom);
router.post('/', auth, RoomController.createRoom);
router.get(
  '/in',
  [body('roomCode').not().isEmpty()],
  auth,
  RoomController.getRoomAndUserByRoomCode
);
router.post(
  '/:roomId/in',
  [body('roomCode').not().isEmpty()],
  auth,
  RoomController.joinRoom
);
router.delete('/:roomId/out', auth, RoomController.leaveRoom);

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
router.get(
  '/:roomId/category/:categoryId/rule',
  auth,
  RuleController.getRulesByCategoryId
);
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
router.get(
  '/:roomId/rule/:ruleId/today',
  auth,
  RuleController.getHomiesWithIsTmpMember
);
router.put(
  '/:roomId/rule/:ruleId/today',
  auth,
  [body('tmpRuleMembers').not().isEmpty()],
  RuleController.updateTmpRuleMembers
);
router.put(
  '/:roomId/rule/:ruleId/check',
  auth,
  [body('isCheck').not().isEmpty()],
  RuleController.updateMyRuleTodoCheck
);
router.get('/:roomId/rules/me', auth, RuleController.getMyRuleInfo);

/**
 * 규칙 카테고리
 */
router.post(
  '/:roomId/rules/category',
  [
    body('categoryName').not().isEmpty().isLength({
      min: 1,
      max: limitNum.RULE_CATEGORY_NAME_MAX_LENGTH
    }),
    body('categoryIcon').not().isEmpty()
  ],
  auth,
  RuleController.createRuleCategory
);

router.put(
  '/:roomId/rules/category/:categoryId',
  [
    body('categoryName').not().isEmpty().isLength({
      min: 1,
      max: limitNum.RULE_CATEGORY_NAME_MAX_LENGTH
    }),
    body('categoryIcon').not().isEmpty()
  ],
  auth,
  RuleController.updateRuleCategory
);

router.delete(
  '/:roomId/rules/category/:categoryId',
  auth,
  RuleController.deleteRuleCategory
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
    body('participants').not().isEmpty().isArray()
  ],
  auth,
  EventController.createEvent
);
router.get('/:roomId/event/:eventId', auth, EventController.getEvent);
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

/**
 * 홈
 */
router.get('/:roomId/home', auth, RoomController.getRoomInfoAtHome);
router.get('/:roomId/rules', auth, RuleController.getRuleInfoAtRuleHome);

export default router;
