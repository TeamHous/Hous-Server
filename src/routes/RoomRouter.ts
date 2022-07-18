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
  // #swagger.summary = '들어간 방 id 조회하기'
  // #swagger.security = [{"JWT": []}]
);
router.post(
  '/',
  auth,
  RoomController.createRoom
  // #swagger.summary = '방 생성하기'
  // #swagger.security = [{"JWT": []}]
  // #swagger.requestBody = { required: false }
);
router.get(
  '/in',
  [body('roomCode').not().isEmpty()],
  auth,
  RoomController.getRoomAndUserByRoomCode
  // #swagger.summary = '방 입장하기 초대코드 입력 시 방 조회'
  // #swagger.security = [{"JWT": []}]
);
router.post(
  '/:roomId/in',
  [body('roomCode').not().isEmpty()],
  auth,
  RoomController.joinRoom
  // #swagger.summary = '방 입장하기'
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  /*
  #swagger.requestBody = {
    required: true,
    schema: {
      required: [
        "roomCode"
      ],
      properties: {
        isCheck: {
          type: "string",
          example: "505TYCMR"
        }
      }
    }
  }
  */
);
router.delete(
  '/:roomId/out',
  auth,
  RoomController.leaveRoom
  // #swagger.summary = '방 퇴사하기'
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  // #swagger.requestBody = { required: false }
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
  // #swagger.summary = '규칙 1개 추가하기'
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  /*
  #swagger.requestBody = {
    required: true,
    schema: {
      required: [
        "notificationState",
        "ruleName",
        "categoryId",
        "isKeyRules",
        "ruleMembers",
        "userId",
        "day"
      ],
      properties: {
        notificationState: {
          type: "boolean",
          example: "true"
        },
        ruleName: {
          type: "string",
          example: "방 청소하기"
        },
        categoryId: {
          type: "string",
          example: "62d4335e17e70062873f3d26"
        },
        isKeyRules: {
          type: "boolean",
          example: "false"
        },
        ruleMembers: {
          type: "array",
          items: {
            type: "object",
            properties: {
              userId: {
                type: "string",
                example: "62d4334c17e70062873f3d1f"
              },
              day: {
                type: "array",
                items: {
                  type: "integer"
                },
                example: [0,2,3]
              }
            }
          }
        },
      }
    }
  }
  */
);
router.get(
  '/:roomId/rule/new',
  auth,
  RuleController.getRuleCreateInfo
  // #swagger.summary = '규칙 생성 시 조회 (규칙 카테고리, 호미 리스트)'
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
);
router.get(
  '/:roomId/category/:categoryId/rule',
  auth,
  RuleController.getRulesByCategoryId
  // #swagger.summary = '카테고리 별 규칙 리스트 조회'
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  // #swagger.parameters['categoryId'] = { description: '규칙 카테고리 id' };
);
router.get(
  '/:roomId/rule/:ruleId',
  auth,
  RuleController.getRuleByRuleId
  // #swagger.summary = '규칙 1개 조회하기'
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
  // #swagger.summary = '규칙 1개 수정하기'
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  // #swagger.parameters['ruleId'] = { description: '규칙 id' };
  /*
  #swagger.requestBody = {
    required: true,
    schema: {
      required: [
        "notificationState",
        "ruleName",
        "categoryId",
        "isKeyRules",
        "ruleMembers",
        "userId",
        "day"
      ],
      properties: {
        notificationState: {
          type: "boolean",
          example: "true"
        },
        ruleName: {
          type: "string",
          example: "방 청소하기"
        },
        categoryId: {
          type: "string",
          example: "62d4335e17e70062873f3d26"
        },
        isKeyRules: {
          type: "boolean",
          example: "false"
        },
        ruleMembers: {
          type: "array",
          items: {
            type: "object",
            properties: {
              userId: {
                type: "string",
                example: "62d4334c17e70062873f3d1f"
              },
              day: {
                type: "array",
                items: {
                  type: "integer"
                },
                example: [0,2,3]
              }
            }
          }
        },
      }
    }
  }
  */
);
router.delete(
  '/:roomId/rule/:ruleId',
  auth,
  RuleController.deleteRule
  // #swagger.summary = '규칙 1개 삭제하기'
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  // #swagger.parameters['ruleId'] = { description: '규칙 id' };
  // #swagger.requestBody = { required: false }
);
router.get(
  '/:roomId/rule/:ruleId/today',
  auth,
  RuleController.getHomiesWithIsTmpMember
  // #swagger.summary = '오늘의 임시 담당자 설정 시 룸메이트 리스트 조회하기'
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  // #swagger.parameters['ruleId'] = { description: '규칙 id' };
);
router.put(
  '/:roomId/rule/:ruleId/today',
  auth,
  [body('tmpRuleMembers').not().isEmpty()],
  RuleController.updateTmpRuleMembers
  // #swagger.summary = '오늘의 임시 담당자 설정하기'
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  // #swagger.parameters['ruleId'] = { description: '규칙 id' };
  /*
  #swagger.requestBody = {
    required: true,
    schema: {
      required: [
        "tmpRuleMembers"
      ],
      properties: {
        tmpRuleMembers: {
          type: "array",
          items: {
            type: "string"
          },
          example: ["62d4334c17e70062873f3d1f"]
        }
      }
    }
  }
  */
);
router.put(
  '/:roomId/rule/:ruleId/check',
  auth,
  [body('isCheck').not().isEmpty()],
  RuleController.updateMyRuleTodoCheck
  // #swagger.summary = '오늘 나의 to-do 체크 상태 변경하기'
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  // #swagger.parameters['ruleId'] = { description: '규칙 id' };
  /*
  #swagger.requestBody = {
    required: true,
    schema: {
      required: [
        "isCheck"
      ],
      properties: {
        isCheck: {
          type: "boolean",
          example: "false"
        }
      }
    }
  }
  */
);
router.get(
  '/:roomId/rules/me',
  auth,
  RuleController.getMyRuleInfo
  // #swagger.summary = '규칙 홈화면 조회하기 (나의 to-do)'
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
  // #swagger.summary = '규칙 카테고리 추가하기'
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  /*
  #swagger.requestBody = {
    required: true,
    schema: {
      required: [
        "categoryName",
        "categoryIcon",
      ],
      properties: {
        categoryName: {
          type: "string",
          example: "청소"
        },
        categoryIcon: {
          type: "string",
          example: "CLEAN"
        }
      }
    }
  }
  */
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
  // #swagger.summary = '규칙 카테고리 수정하기'
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  // #swagger.parameters['categoryId'] = { description: '규칙 카테고리 id' };
  /*
  #swagger.requestBody = {
    required: true,
    schema: {
      required: [
        "categoryName",
        "categoryIcon",
      ],
      properties: {
        categoryName: {
          type: "string",
          example: "청소"
        },
        categoryIcon: {
          type: "string",
          example: "CLEAN"
        }
      }
    }
  }
  */
);

router.delete(
  '/:roomId/rules/category/:categoryId',
  auth,
  RuleController.deleteRuleCategory
  // #swagger.summary = '규칙 카테고리 삭제하기'
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  // #swagger.parameters['categoryId'] = { description: '규칙 카테고리 id' };
  // #swagger.requestBody = { required: false }
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
  // #swagger.summary = '이벤트 추가하기'
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  /*
  #swagger.requestBody = {
    required: true,
    schema: {
      required: [
        "eventName",
        "eventIcon",
        "date",
        "participants"
      ],
      properties: {
        eventName: {
          type: "string",
          example: "호미 생일파티"
        },
        eventIcon: {
          type: "string",
          example: "PARTY"
        },
        date: {
          type: "string",
          example: "2022-07-23"
        },
        participants: {
          type: "array",
          items: {
            type: "string"
          },
          example: ["62d4334c17e70062873f3d1f"]
        }
      }
    }
  }
  */
);
router.get(
  '/:roomId/event/:eventId',
  auth,
  EventController.getEvent
  // #swagger.summary = '이벤트 조회하기'
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
  // #swagger.summary = '이벤트 수정하기'
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  // #swagger.parameters['eventId'] = { description: '이벤트 id' };
  /*
  #swagger.requestBody = {
    required: true,
    schema: {
      required: [
        "eventName",
        "eventIcon",
        "date",
        "participants"
      ],
      properties: {
        eventName: {
          type: "string",
          example: "호미 생일파티"
        },
        eventIcon: {
          type: "string",
          example: "PARTY"
        },
        date: {
          type: "string",
          example: "2022-07-23"
        },
        participants: {
          type: "array",
          items: {
            type: "string"
          },
          example: ["62d4334c17e70062873f3d1f"]
        }
      }
    }
  }
  */
);
router.delete(
  '/:roomId/event/:eventId',
  auth,
  EventController.deleteEvent
  // #swagger.summary = '이벤트 삭제하기'
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  // #swagger.parameters['eventId'] = { description: '이벤트 id' };
  // #swagger.requestBody = { required: false }
);

/**
 * 홈
 */
router.get(
  '/:roomId/home',
  auth,
  RoomController.getRoomInfoAtHome
  // #swagger.summary = '홈화면 조회하기'
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
);
router.get(
  '/:roomId/rules',
  auth,
  RuleController.getRuleInfoAtRuleHome
  // #swagger.summary = '규칙 홈화면 조회하기 (오늘의 to-do)'
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
);

export default router;
