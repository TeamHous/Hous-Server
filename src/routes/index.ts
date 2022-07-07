// router index file
import { Router } from 'express';
import AuthRouter from './AuthRouter';
import RoomRouter from './RoomRouter';

const router: Router = Router();

router.use('/auth', AuthRouter);
router.use('/room', RoomRouter);

export default router;
