import { Router } from 'express';
import { body } from 'express-validator/check';
import { UserController } from '../controllers';
import auth from '../middleware/auth';

const router: Router = Router();

router.get('/profile/me', auth, UserController.getUser);
router.put(
  '/profile/me',
  [body('userName').notEmpty()],
  auth,
  UserController.updateUser
);

export default router;
