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
      .isLength({ max: limitNum.PROFILE_NAME_MAX_LENGTH }),
    body('job').isLength({ max: limitNum.PROFILE_JOB_MAX_LENGTH }),
    body('introduction').isLength({
      max: limitNum.PROFILE_INTRODUCTION_MAX_LENGTH
    })
  ],
  auth,
  UserController.updateUser
);

export default router;
