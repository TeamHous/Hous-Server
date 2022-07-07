import { Router } from 'express';
import { body } from 'express-validator/check';
import { AuthController } from '../controllers';

const router: Router = Router();

router.post(
  '/signup',
  [
    body('email').isEmail(),
    body('password').not().isEmpty(),
    body('userName').not().isEmpty(),
    body('gender').not().isEmpty(),
    body('fcmToken').not().isEmpty()
  ],
  AuthController.signup
);
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').not().isEmpty(),
    body('fcmToken').not().isEmpty()
  ],
  AuthController.login
);

export default router;
