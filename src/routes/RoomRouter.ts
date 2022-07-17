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
router.get(
  '/',
  auth,
  RoomController.getRoom
  // #swagger.security = [{"JWT": []}]
);
router.post(
  '/',
  auth,
  RoomController.createRoom
  // #swagger.security = [{"JWT": []}]
);
router.get(
  '/in',
  [body('roomCode').not().isEmpty()],
  auth,
  RoomController.getRoomAndUserByRoomCode
  // #swagger.security = [{"JWT": []}]
);
router.post(
  '/:roomId/in',
  [body('roomCode').not().isEmpty()],
  auth,
  RoomController.joinRoom
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
);
router.delete(
  '/:roomId/out',
  auth,
  RoomController.leaveRoom
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
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
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
);
router.get(
  '/:roomId/rule/new',
  auth,
  RuleController.getRuleCreateInfo
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
);
router.get(
  '/:roomId/category/:categoryId/rule',
  auth,
  RuleController.getRulesByCategoryId
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  // #swagger.parameters['categoryId'] = { description: '규칙 카테고리 id' };
);
router.get(
  '/:roomId/rule/:ruleId',
  auth,
  RuleController.getRuleByRuleId
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  // #swagger.parameters['ruleId'] = { description: '규칙 id' };
);
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
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  // #swagger.parameters['ruleId'] = { description: '규칙 id' };
);
router.delete(
  '/:roomId/rule/:ruleId',
  auth,
  RuleController.deleteRule
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  // #swagger.parameters['ruleId'] = { description: '규칙 id' };
);
router.get(
  '/:roomId/rule/:ruleId/today',
  auth,
  RuleController.getHomiesWithIsTmpMember
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  // #swagger.parameters['ruleId'] = { description: '규칙 id' };
);
router.put(
  '/:roomId/rule/:ruleId/today',
  auth,
  [body('tmpRuleMembers').not().isEmpty()],
  RuleController.updateTmpRuleMembers
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  // #swagger.parameters['ruleId'] = { description: '규칙 id' };
);
router.put(
  '/:roomId/rule/:ruleId/check',
  auth,
  [body('isCheck').not().isEmpty()],
  RuleController.updateMyRuleTodoCheck
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  // #swagger.parameters['ruleId'] = { description: '규칙 id' };
);
router.get(
  '/:roomId/rules/me',
  auth,
  RuleController.getMyRuleInfo
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
);

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
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
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
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  // #swagger.parameters['categoryId'] = { description: '규칙 카테고리 id' };
);

router.delete(
  '/:roomId/rules/category/:categoryId',
  auth,
  RuleController.deleteRuleCategory
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  // #swagger.parameters['categoryId'] = { description: '규칙 카테고리 id' };
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
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
);
router.get(
  '/:roomId/event/:eventId',
  auth,
  EventController.getEvent
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  // #swagger.parameters['eventId'] = { description: '이벤트 id' };
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
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  // #swagger.parameters['eventId'] = { description: '이벤트 id' };
);
router.delete(
  '/:roomId/event/:eventId',
  auth,
  EventController.deleteEvent
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  // #swagger.parameters['eventId'] = { description: '이벤트 id' };
);

/**
 * 홈
 */
router.get(
  '/:roomId/home',
  auth,
  RoomController.getRoomInfoAtHome
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
);
router.get(
  '/:roomId/rules',
  auth,
  RuleController.getRuleInfoAtRuleHome
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
);

export default router;
