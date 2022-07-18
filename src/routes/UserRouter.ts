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
  // #swagger.requestBody = { required: false }
);

/**
 * 프로필
 */
router.get(
  '/profile',
  auth,
  UserController.getUserAtHome
  // #swagger.security = [{"JWT": []}]
);
router.get(
  '/profile/me',
  auth,
  UserController.getUserAtModify
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
  // #swagger.security = [{"JWT": []}]
);
router.put(
  '/setting/notification',
  auth,
  UserController.updateUserNotificationState
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
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['homieId'] = { description: '호미의 유저 id' };
);

/**
 * 성향 테스트 등록 및 수정
 */
router.put(
  '/type/test',
  [body('typeScore').not().isEmpty().isArray()],
  auth,
  UserController.updateUserTypeScore
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
  // #swagger.security = [{"JWT": []}]
);
router.get(
  '/:userId/type',
  auth,
  UserController.getHomieTypeDetail
  // #swagger.security = [{"JWT": []}]
  // #swagger.parameters['userId'] = { description: '유저 id' };
);

export default router;
