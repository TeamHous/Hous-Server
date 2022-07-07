// router index file
import { Router } from 'express';
import AuthRouter from './AuthRouter';
import UserRouter from './UserRouter';
import RoomRouter from './RoomRouter';

const router: Router = Router();

router.use('/auth', AuthRouter);
router.use('/user', UserRouter);
router.use('/room', RoomRouter);

export default router;
