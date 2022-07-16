import { Router } from 'express';
import { body } from 'express-validator/check';
import { UserController } from '../controllers';
import auth from '../middleware/auth';
import limitNum from '../modules/limitNum';

const router: Router = Router();

/**
 * 프로필
 */
router.get('/profile', auth, UserController.getUserAtHome);
router.get('/profile/me', auth, UserController.getUserAtModify);
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
);
router.get('/setting', auth, UserController.getUserSetting);
router.put(
  '/setting/notification',
  auth,
  UserController.updateUserNotificationState
);

/**
 * 룸메이트 조회 (홈화면에서 호미 클릭 시)
 */
router.get('/:homieId', auth, UserController.getHomieProfile);

/**
 * 성향 테스트 등록 및 수정
 */
router.get('/type/test', auth, UserController.getTypeTestInfo);
router.put(
  '/type/test',
  [body('typeScore').not().isEmpty().isArray()],
  auth,
  UserController.updateUserTypeScore
);
router.get('/me/type/:typeId', auth, UserController.getMyTypeDetail);

export default router;
