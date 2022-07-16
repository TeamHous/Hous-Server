import { Router } from 'express';
import auth from '../middleware/auth';
import { TypeController } from '../controllers';

const router: Router = Router();

router.get('/test', auth, TypeController.getTypeTestInfo);

export default router;
