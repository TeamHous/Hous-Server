import { Router } from 'express';
import { body, query } from 'express-validator/check';
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
  /*
  #swagger.responses[200] = {
    schema: {
      "status": 200,
      "success": true,
      "message": "방 조회 성공입니다.",
      "data": "62cac03afa32959ed64ae000 or null"
    }
  }
  */
);
router.post(
  '/',
  auth,
  RoomController.createRoom
  // #swagger.summary = '방 생성하기'
  // #swagger.security = [{"JWT": []}]
  // #swagger.requestBody = { required: false }
  /*
  #swagger.responses[201] = {
    schema: {
      "status": 201,
      "success": true,
      "message": "방 생성 성공입니다.",
      "data": {
        "_id": "62c8685d3aba521ff9d4b8a8",
        "roomCode": "LZ7MW23D"
      }
    }
  }
  */
);
router.get(
  '/in',
  [query('roomCode').isString().trim()],
  auth,
  RoomController.getRoomAndUserByRoomCode
  // #swagger.summary = '방 입장하기 초대코드 입력 시 방 조회'
  // #swagger.security = [{"JWT": []}]
  /*
  #swagger.responses[200] = {
    schema: {
      "status": 200,
      "success": true,
      "message": "방 조회 성공입니다.",
      "data": {
        "_id": "62c871509bfca489f95f6a15",
        "typeColor": "GRAY",
        "userName": " 고구마",
        "introduction": ""
      }
    }
  }
  */
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
  /*
  #swagger.responses[200] = {
    schema: {
      "status": 200,
      "success": true,
      "message": "방 참가 성공입니다.",
      "data": "62c871509bfca489f95f6a15"
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
  /*
  #swagger.responses[200] = {
    schema: {
      "status": 200,
      "success": true,
      "message": "방 퇴사 성공입니다.",
      "data": null
    }
  }
  */
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
  /*
  #swagger.responses[201] = {
    schema: {
      "status": 201,
      "success": true,
      "message": "규칙 생성 성공입니다.",
      "data": {
        "roomId": "62cac03afa32959ed64ae000",
        "categoryId": "62cac03afa32959ed64ae003",
        "ruleName": "규칙",
        "ruleMembers": [
          {
            "userId": null,
            "day": [ 1, 3 ],
            "_id": "62caf76391f814e6272256d0"
          }
        ],
        "tmpRuleMembers": [],
        "isKeyRules": false,
        "notificationState": false,
        "tmpUpdatedDate": "2022-06-30T15:59:31.990Z",
        "_id": "62caf76391f814e6272256cf",
        "createdAt": "2022-07-10T15:59:32.006Z",
        "updatedAt": "2022-07-10T15:59:32.006Z",
        "__v": 0
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
  /*
  #swagger.responses[200] = {
    schema: {
      "status": 200,
      "success": true,
      "message": "규칙 생성 시 조회 성공입니다.",
      "data": {
        "ruleCategories": [
          {
            "_id": "62cac03afa32959ed64ae003",
            "categoryName": "청소"
          }
        ],
        "homies": [
          {
            "_id": "62cabf1435a2e50fb7265d9e",
            "name": " 고구마1",
            "typeColor": "GRAY"
          }
        ]
      }
    }
  }
  */
);
router.get(
  '/:roomId/category/:categoryId/rule',
  auth,
  RuleController.getRulesByCategoryId
  // #swagger.summary = '카테고리 별 규칙 리스트 조회'
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  // #swagger.parameters['categoryId'] = { description: '규칙 카테고리 id' };
  /*
  #swagger.responses[200] = {
    schema: {
      "status": 200,
      "success": true,
      "message": "카테고리 별 규칙 조회 성공입니다.",
      "data": {
        "keyRules": [
          {
            "_id": "62cc81ac1a034f0287c5c6ec",
            "ruleName": " 상단규칙"
          }
        ],
        "rules": [
          {
            "_id": "62cc7d1d39f8cdcfa720900f",
            "ruleName": "청소하기",
            "membersCnt": 4,
            "typeColors": [ "GRAY", "GREEN", "RED" ]
          }
        ]
      }
    }
  }
  */
);
router.get(
  '/:roomId/rule/:ruleId',
  auth,
  RuleController.getRuleByRuleId
  // #swagger.summary = '규칙 1개 조회하기'
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  // #swagger.parameters['ruleId'] = { description: '규칙 id' };
  /*
  #swagger.responses[200] = {
    schema: {
      "status": 200,
      "success": true,
      "message": "규칙 조회 성공입니다.",
      "data": {
        "rule": {
          "_id": "62cb2b6c9321affd2a5da2c0",
          "notificationState": false,
          "ruleName": "15자를넘을경우에러입니다",
          "ruleCategory": {
            "_id": "62cac03afa32959ed64ae003",
            "categoryName": "청소"
          },
          "isKeyRules": false,
          "ruleMembers": [
            {
              "homie": {
                "_id": "62cabf1435a2e50fb7265d9e",
                "name": " 고구마1",
                "typeColor": "GRAY"
              },
              "day": [ 1, 3 ]
            }
          ]
        },
        "ruleCategories": [
          {
            "_id": "62cac03afa32959ed64ae003",
            "categoryName": "청소"
          }
        ],
        "homies": [
          {
            "_id": "62cabf1435a2e50fb7265d9e",
            "name": " 고구마1",
            "typeColor": "GRAY"
          }
        ]
      }
    }
  }
  */
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
  /*
  #swagger.responses[200] = {
    schema: {
      "status": 200,
      "success": true,
      "message": "규칙 수정 성공입니다.",
      "data": {
        "_id": "62cbd8b5647a6c0c44d65ed1",
        "roomId": "62cac03afa32959ed64ae000",
        "categoryId": "62cac03afa32959ed64ae003",
        "ruleName": "중복체크gggg",
        "ruleMembers": [
          {
            "userId": "62cabf1435a2e50fb7265d9e",
            "day": [ 1, 5, 6 ],
            "_id": "62cbda4af5472cb0cdf50ef6"
          }
        ],
        "tmpRuleMembers": [],
        "isKeyRules": false,
        "notificationState": false,
        "tmpUpdatedDate": "2022-07-01T08:00:53.125Z",
        "createdAt": "2022-07-11T08:00:53.144Z",
        "updatedAt": "2022-07-11T08:07:38.472Z",
        "__v": 0
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
  /*
  #swagger.responses[200] = {
    schema: {
      "status": 200,
      "success": true,
      "message": "규칙 삭제 성공입니다.",
      "data": null
    }
  }
  */
);
router.get(
  '/:roomId/rule/:ruleId/today',
  auth,
  RuleController.getHomiesWithIsTmpMember
  // #swagger.summary = '오늘의 임시 담당자 설정 시 룸메이트 리스트 조회하기'
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  // #swagger.parameters['ruleId'] = { description: '규칙 id' };
  /*
  #swagger.responses[200] = {
    schema: {
      "status": 200,
      "success": true,
      "message": "오늘의 임시 담당자 여부를 포함한 호미 리스트 조회 성공입니다.",
      "data": {
        "_id": "62cef1fd5742e5b90c586d7d",
        "homies": [
          {
            "_id": "62cc7409c7db06c46adf652f",
            "userName": " 감자2",
            "isChecked": true,
            "typeColor": "GRAY"
          }
        ]
      }
    }
  }
  */
);
router.put(
  '/:roomId/rule/:ruleId/today',
  auth,
  [body('tmpRuleMembers').isArray()],
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
  /*
  #swagger.responses[200] = {
    schema: {
      "status": 200,
      "success": true,
      "message": "오늘의 임시 담당자 설정 성공입니다.",
      "data": {
        "_id": "62cd4e8342b3d0a3ee7b48c4",
        "ruleName": " 임시 담당자 규칙",
        "tmpRuleMembers": [
          "62cc7409c7db06c46adf652f",
          "62cc7420d7868591384e4eb0"
        ]
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
  /*
  #swagger.responses[200] = {
    schema: {
      "status": 200,
      "success": true,
      "message": "나의 to-do 체크 수정 성공입니다.",
      "data": {
        "isCheck": true
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
  /*
  #swagger.responses[200] = {
    schema: {
      "status": 200,
      "success": true,
      "message": "나의 to-do 조회 성공입니다.",
      "data": [
        {
          "_id": "62cef1fd5742e5b90c586d7d",
          "categoryIcon": "CLEAN",
          "ruleName": " 임시 담당자 설정 테스트",
          "isChecked": false
        }
      ]
    }
  }
  */
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
  /*
  #swagger.responses[201] = {
    schema: {
      "status": 201,
      "success": true,
      "message": "규칙 카테고리 생성 성공입니다.",
      "data": {
        "_id": "62c7c2ab6ee3cb1b3ec79fb9",
        "roomId": "62c7c258818c969cd434da01",
        "ruleCategoryName": "청소",
        "ruleCategoryIcon": "CLEAN",
        "ruleCnt": 0
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
  /*
  #swagger.responses[200] = {
    schema: {
      "status": 200,
      "success": true,
      "message": "규칙 카테고리 수정 성공입니다.",
      "data": {
        "_id": "62cc47f27cc4ea6b4b4ca830",
        "roomId": "62cac03afa32959ed64ae000",
        "ruleCategoryName": "분리수거",
        "ruleCategoryIcon": "TRASH",
        "ruleCnt": 0
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
  /*
  #swagger.responses[200] = {
    schema: {
      "status": 200,
      "success": true,
      "message": "규칙 카테고리 삭제 성공입니다.",
      "data": null
    }
  }
  */
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
    body('date').not().isEmpty().isDate({ format: 'YYYY-MM-DD' }),
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
  /*
  #swagger.responses[201] = {
    schema: {
      "status": 201,
      "success": true,
      "message": "이벤트 생성 성공입니다.",
      "data": {
        "_id": "62c940dfa940516bebb8c668",
        "eventName": "혜정이 생파",
        "eventIcon": "PARTY",
        "date": "2023-03-04T00:00:00.000Z",
        "participants": [
          "62c871289bfca489f95f6a0a",
          "62c8712b9bfca489f95f6a0d"
        ]
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
  /*
  #swagger.responses[200] = {
    schema: {
      "status": 200,
      "success": true,
      "message": "이벤트 조회 성공입니다.",
      "data": {
        "_id": "62d4335e17e70062873f3d28",
        "eventName": "여기에 이벤트를 추가하세요.",
        "eventIcon": "PARTY",
        "date": "2022-07-28",
        "participants": [
          {
                "_id": "62d4334c17e70062873f3d1f",
                "userName": "워뇽이",
                "isChecked": true,
                "typeColor": "GRAY"
            }
        ]
      }
    }
  }
  */
);
router.put(
  '/:roomId/event/:eventId',
  [
    body('eventName')
      .not()
      .isEmpty()
      .isLength({ min: 1, max: limitNum.EVENT_NAME_MAX_LENGTH }),
    body('eventIcon').not().isEmpty(),
    body('date').not().isEmpty().isDate({ format: 'YYYY-MM-DD' }),
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
  /*
  #swagger.responses[200] = {
    schema: {
      "status": 200,
      "success": true,
      "message": "이벤트 수정 성공입니다.",
      "data": {
        "_id": "62c9acb1409b9566407fe299",
        "eventName": "이벤트 수정",
        "eventIcon": "CLEAN",
        "date": "2023-03-04",
        "participants": [
            "62c871289bfca489f95f6a0a"
        ]
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
  /*
  #swagger.responses[200] = {
    schema: {
      "status": 200,
      "success": true,
      "message": "이벤트 수정 성공입니다.",
      "data": {
        "_id": "62c9acb1409b9566407fe299",
        "eventName": "이벤트 수정",
        "eventIcon": "CLEAN",
        "date": "2023-03-04",
        "participants": [
            "62c871289bfca489f95f6a0a"
        ]
      }
    }
  }
  */
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
  /*
  #swagger.responses[200] = {
    schema: {
      "status": 200,
      "success": true,
      "message": "홈화면 조회 성공입니다.",
      "data": {
        "eventList": [
          {
            "_id": "62d4335e17e70062873f3d28",
            "eventIcon": "PARTY",
            "dDay": "9"
          }
        ],
        "keyRulesList": [
          "설거지는 먹고 바로하기"
        ],
        "todoList": [
          {
            "isChecked": false,
            "ruleName": "규칙 테스트1"
          }
        ],
        "homieProfileList": [
          {
            "_id": "62d52147579fd88859ba700f",
            "userName": "민재",
            "typeName": "임시 디폴트",
            "typeColor": "GRAY"
          }
        ],
        "roomCode": "505TYCMR"
      }
    }
  }
  */
);
router.get(
  '/:roomId/rules',
  auth,
  RuleController.getRuleInfoAtRuleHome
  // #swagger.summary = '규칙 홈화면 조회하기 (오늘의 to-do)'
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['roomId'] = { description: '방 id' };
  /*
  #swagger.responses[200] = {
    schema: {
      "status": 200,
      "success": true,
      "message": "규칙 홈화면 조회 성공입니다.",
      "data": {
        "homeRuleCategories": [
          {
            "_id": "62cc7440d7868591384e4ebb",
            "categoryIcon": "CLEAN",
            "categoryName": "청소"
          }
        ],
        "todayTodoRules": [
          {
            "_id": "62cc814a1a034f0287c5c6d4",
            "ruleName": " nn 구분",
            "todayMembersWithTypeColor": [
              {
                "userName": "김혜정테스",
                "typeColor": "GREEN"
              }
            ],
            "isTmpMember": false,
            "isAllChecked": false
          }
        ]
      }
    }
  }
  */
);

export default router;
