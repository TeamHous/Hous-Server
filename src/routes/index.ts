// router index file
import { Router } from 'express';
import AuthRouter from './AuthRouter';
import UserRouter from './UserRouter';

const router: Router = Router();

router.use('/auth', AuthRouter);
router.use('/user', UserRouter);

export default router;
