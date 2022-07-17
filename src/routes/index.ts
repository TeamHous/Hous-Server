// router index file
import { Router } from 'express';
import AuthRouter from './AuthRouter';
import UserRouter from './UserRouter';
import RoomRouter from './RoomRouter';
import TypeRouter from './TypeRouter';

const router: Router = Router();

router.use('/auth', AuthRouter);
router.use('/user', UserRouter);
router.use('/room', RoomRouter);
router.use('/type', TypeRouter);

export default router;
