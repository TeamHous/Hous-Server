import { Router } from 'express';
import { body } from 'express-validator/check';
import { UserController } from '../controllers';
import auth from '../middleware/auth';
import limitNum from '../modules/limitNum';

const router: Router = Router();

/**
 * 사용자 탈퇴
 */
router.delete(
  '/',
  auth,
  UserController.deleteUser
  // #swagger.summary = '탈퇴하기'
  // #swagger.requestBody = { required: false }
);

/**
 * 프로필
 */
router.get(
  '/profile',
  auth,
  UserController.getUserAtHome
  // #swagger.summary = '프로필 홈화면 조회하기'
  // #swagger.security = [{"JWT": []}]
  /*
  #swagger.responses[200] = {
    schema: {
      status: 200,
      success: true,
      message: '사용자 정보 조회 성공입니다.',
      data:  {
        userName: "김호미",
        job: "곧 졸업 대학생",
        introduction: "안녕하세여~!! 저는 김호미입니다~!!",
        hashTag: [ 
          "ESFJ", "집순이"
        ],
        typeId: "62d28636cc1d0ea0fc0c4b31",
        typeName: "임시 디폴트",
        typeColor: "GRAY",
        typeScore: [
          5, 2, 2, 4, 5
        ],
        notificationState: true
      }
    }
  }
  */
);
router.get(
  '/profile/me',
  auth,
  UserController.getUserAtModify
  // #swagger.summary = '나의 프로필 수정 시 정보 조회하기'
  // #swagger.security = [{"JWT": []}]
  /*
  #swagger.responses[200] = {
    schema: {
      status: 200,
      success: true,
      message: '사용자 정보 조회 성공입니다.',
      data:  {
        userName: "김호미",
        job: "곧 졸업 대학생",
        introduction: "안녕하세여~!! 저는 김호미입니다~!!",
        hashTag: [ 
          "ESFJ", "집순이"
        ],
        typeName: "임시 디폴트",
        typeColor: "GRAY",
        typeScore: [
          5, 2, 2, 4, 5
        ]
      }
    }
  }
  */
);
router.put(
  '/profile/me',
  [
    body('userName')
      .not()
      .isEmpty()
      .isLength({ min: 1, max: limitNum.PROFILE_NAME_MAX_LENGTH }),
    body('job').isLength({ min: 0, max: limitNum.PROFILE_JOB_MAX_LENGTH }),
    body('introduction').isLength({
      min: 0,
      max: limitNum.PROFILE_INTRODUCTION_MAX_LENGTH
    })
  ],
  auth,
  UserController.updateUser
  // #swagger.summary = '나의 프로필 수정하기'
  // #swagger.security = [{"JWT": []}]
  /*
  #swagger.requestBody = {
    required: true,
    schema: {
      required: [
        "userName"
      ],
      properties: {
        userName: {
          type: "string",
          example: "김호미"
        },
        job: {
          type: "string",
          example: "대학생"
        },
        introduction: {
          type: "string",
          example: "김호미입니다~!!!!"
        },
        hashTag: {
          type: "array",
          items: {
            type: "string"
          },
          maxItems: 3,
          example: ["ESFJ", "호미호미"]
        }
      }
    }
  }
  */
  /*
  #swagger.responses[200] = {
    schema: {
      status: 200,
      success: true,
      message: '사용자 정보 수정 성공입니다.',
      data:  {
        userName: "김호미",
        job: "곧 졸업 대학생",
        introduction: "안녕하세여~!! 저는 김호미입니다~!!",
        hashTag: [ 
          "ESFJ", "집순이"
        ]
      }
    }
  }
  */
);
router.get(
  '/setting',
  auth,
  UserController.getUserSetting
  // #swagger.summary = '설정 조회하기'
  // #swagger.security = [{"JWT": []}]
  /*
  #swagger.responses[200] = {
    schema: {
      status: 200,
      success: true,
      message: '사용자 설정 조회 성공입니다.',
      data:  {
        notificationState: true
      }
    }
  }
  */
);
router.put(
  '/setting/notification',
  auth,
  UserController.updateUserNotificationState
  // #swagger.summary = '설정 - 알림 여부 수정하기'
  // #swagger.security = [{"JWT": []}]
  /*
  #swagger.requestBody = {
    required: true,
    schema: {
      required: [
        "notificationState"
      ],
      properties: {
        notificationState: {
          type: "boolean",
          example: "true"
        }
      }
    }
  }
  */
  /*
  #swagger.responses[200] = {
    schema: {
      status: 200,
      success: true,
      message: '사용자 알림 설정 수정 성공입니다.',
      data:  {
        notificationState: true
      }
    }
  }
  */
);

/**
 * 룸메이트 조회 (홈화면에서 호미 클릭 시)
 */
router.get(
  '/:homieId',
  auth,
  UserController.getHomieProfile
  // #swagger.summary = '호미(룸메이트) 조회하기'
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['homieId'] = { description: '호미(룸메이트)의 유저 id' };
  /*
  #swagger.responses[200] = {
    schema: {
      status: 200,
      success: true,
      message: '호미 프로필 조회 성공입니다.',
      data:  {
        userName: " 고구마",
        job: "대학생",
        introduction: "안녕하세요~!! 고구마 입니다!!",
        hashTag: [ "ESFJ", "집순이"],
        typeId: "62d28636cc1d0ea0fc0c4b31",
        typeName: "임시 디폴트",
        typeColor: "GRAY",
        typeScore: [ 2, 5, 4, 3, 4]
      }
    }
  }
  */
);

/**
 * 성향 테스트 등록 및 수정
 */
router.put(
  '/type/test',
  [body('typeScore').not().isEmpty().isArray()],
  auth,
  UserController.updateUserTypeScore
  // #swagger.summary = '성향 테스트 점수 등록 및 수정'
  // #swagger.security = [{"JWT": []}]
  /*
  #swagger.requestBody = {
    required: true,
    schema: {
      required: [
        "typeScore"
      ],
      properties: {
        typeScore: {
          type: "array",
          items: {
            type: "integer"
          },
          minItems: 5,
          maxItems: 5,
          example: [2, 5, 10, 4, 12]
        }
      }
    }
  }
  */
  /*
  #swagger.responses[200] = {
    schema: {
      status: 200,
      success: true,
      message: '호미 프로필 조회 성공입니다.',
      data:  {
        _id: "62cc7428d7868591384e4eb3",
        typeId: "62d28636cc1d0ea0fc0c4b31",
        typeScore: [ 2, 5, 4, 3, 4]
      }
    }
  }
  */
);
router.get(
  '/me/type',
  auth,
  UserController.getMyTypeDetail
  // #swagger.summary = '나의 성향 자세히보기'
  // #swagger.security = [{"JWT": []}]
  /*
  #swagger.responses[200] = {
    schema: {
      status: 200,
      success: true,
      message: "사용자 성향 상세 조회 성공입니다.",
      data: {
        userName: "동글동글",
        typeName: "늘 행복한 동글이",
        typeColor: "YELLOW",
        typeImg: "https://team-hous.s3.ap-northeast-2.amazonaws.com/Type/color/type_yellow.png",
        typeOneComment: "어떤 상황에서도 Happy -",
        typeDesc: "둥글둥글한 사람이에요. 민감하게 생각하는 영역이\n거의 없어 공동생활에 쉽게 적응할 수 있어요.\n동글이님과 함께 생활하는 룸메이트는\n조금 더 세심한 배려가 필요한 영역이 있다면\n동글이님과 직접 얘기해보는 것도 좋을 거예요.",
        typeRulesTitle: "동글이와 함께 정하면 좋은 Rule!",
        typeRules: [
            "밥 먹고 바로 설거지하기",
            "샤워 후 머리카락 치우기"
        ],
        good: {
            typeName: "슈퍼 팔로워 셋돌이",
            typeImg: "https://team-hous.s3.ap-northeast-2.amazonaws.com/Type/color/type_red.png"
        },
        bad: {
            typeName: "룰 세터 육각이",
            typeImg: "https://team-hous.s3.ap-northeast-2.amazonaws.com/Type/color/type_green.png"
        }
      }
    }
  }
  */
);
router.get(
  '/:userId/type',
  auth,
  UserController.getHomieTypeDetail
  // #swagger.summary = '룸메이트의 성향 자세히보기'
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['userId'] = { description: '유저 id' };
  /*
  #swagger.responses[200] = {
    schema: {
      status: 200,
      success: true,
      message: "사용자 성향 상세 조회 성공입니다.",
      data: {
        userName: "동글동글",
        typeName: "늘 행복한 동글이",
        typeColor: "YELLOW",
        typeImg: "https://team-hous.s3.ap-northeast-2.amazonaws.com/Type/color/type_yellow.png",
        typeOneComment: "어떤 상황에서도 Happy -",
        typeDesc: "둥글둥글한 사람이에요. 민감하게 생각하는 영역이\n거의 없어 공동생활에 쉽게 적응할 수 있어요.\n동글이님과 함께 생활하는 룸메이트는\n조금 더 세심한 배려가 필요한 영역이 있다면\n동글이님과 직접 얘기해보는 것도 좋을 거예요.",
        typeRulesTitle: "동글이와 함께 정하면 좋은 Rule!",
        typeRules: [
            "밥 먹고 바로 설거지하기",
            "샤워 후 머리카락 치우기"
        ],
        good: {
            typeName: "슈퍼 팔로워 셋돌이",
            typeImg: "https://team-hous.s3.ap-northeast-2.amazonaws.com/Type/color/type_red.png"
        },
        bad: {
            typeName: "룰 세터 육각이",
            typeImg: "https://team-hous.s3.ap-northeast-2.amazonaws.com/Type/color/type_green.png"
        }
      }
    }
  }
  */
);

export default router;
