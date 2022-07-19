// router index file
import { Router } from 'express';
import AuthRouter from './AuthRouter';
import UserRouter from './UserRouter';
import RoomRouter from './RoomRouter';
import TypeRouter from './TypeRouter';

const router: Router = Router();

router.use(
  '/auth',
  AuthRouter
  // #swagger.tags = ['Auth']
);
router.use(
  '/user',
  UserRouter
  // #swagger.tags = ['User']
);
router.use(
  '/room',
  RoomRouter
  // #swagger.tags = ['Room']
);
router.use(
  '/type',
  TypeRouter
  // #swagger.tags = ['Type']
);

export default router;
