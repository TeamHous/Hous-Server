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
);
router.get(
  '/profile/me',
  auth,
  UserController.getUserAtModify
  // #swagger.summary = '나의 프로필 수정 시 정보 조회하기'
  // #swagger.security = [{"JWT": []}]
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
          example: ["ESFJ", "호미호미"]
        }
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
);
router.get(
  '/me/type',
  auth,
  UserController.getMyTypeDetail
  // #swagger.summary = '나의 성향 자세히보기'
  // #swagger.security = [{"JWT": []}]
);
router.get(
  '/:userId/type',
  auth,
  UserController.getHomieTypeDetail
  // #swagger.summary = '룸메이트의 성향 자세히보기'
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['userId'] = { description: '유저 id' };
);

export default router;
