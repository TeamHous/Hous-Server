import { Router } from 'express';
import { body } from 'express-validator/check';
import { RoomController } from '../controllers';
import auth from '../middleware/auth';

const router: Router = Router();

router.post(
  '/',
  [body('roomName').notEmpty()],
  auth,
  RoomController.createRoom
);
router.post(
  '/in',
  [body('roomCode').notEmpty()],
  auth,
  RoomController.joinRoom
);

export default router;
