import { Router } from 'express';
import auth from '../middleware/auth';
import { TypeController } from '../controllers';

const router: Router = Router();

router.get(
  '/test',
  auth,
  TypeController.getTypeTestInfo
  // #swagger.summary = '성향 테스트 문제 조회'
  // #swagger.security = [{"JWT": []}]
);

export default router;
