import { Router } from 'express';
import { RoomController } from '../controllers';
import auth from '../middleware/auth';

const router: Router = Router();

router.post('/', auth, RoomController.createRoom);

export default router;
