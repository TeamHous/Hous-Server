import { Router } from 'express';
import { body } from 'express-validator/check';
import { UserController } from '../controllers';
import auth from '../middleware/auth';
import limitNum from '../modules/limitNum';

const router: Router = Router();

router.get('/profile/me', auth, UserController.getUser);
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

export default router;
