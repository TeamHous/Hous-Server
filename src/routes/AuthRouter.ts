import { Router } from 'express';
import { body } from 'express-validator/check';
import { AuthController } from '../controllers';

const router: Router = Router();

router.post(
  '/signup',
  [
    body('email').isEmail(),
    body('password').not().isEmpty(),
    body('userName').not().isEmpty(),
    body('gender').not().isEmpty(),
    body('fcmToken').not().isEmpty()
  ],
  AuthController.signup
  /*
  #swagger.requestBody = {
    required: true,
    schema: {
      required: [
        "email",
        "password",
        "userName",
        "gender",
        "fcmToken"
      ],
      properties: {
        email: {
          type: "hous@naver.com",
          example: "true"
        },
        password: {
          type: "string",
          example: "password"
        },
        userName: {
          type: "string",
          example: "김호미"
        },
        gender: {
          type: "string",
          example: "여자"
        },
        birthday: {
          type: "string",
          example: "2000-01-01"
        },
        fcmToken: {
          type: "string",
          example: "afjadsjcioajvasfjaisfojasdkvjais"
        }
      }
    }
  }
  */
);
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').not().isEmpty(),
    body('fcmToken').not().isEmpty()
  ],
  AuthController.login
  /*
  #swagger.requestBody = {
    required: true,
    schema: {
      required: [
        "email",
        "password",
        "fcmToken"
      ],
      properties: {
        email: {
          type: "hous@naver.com",
          example: "true"
        },
        password: {
          type: "string",
          example: "password"
        },
        fcmToken: {
          type: "string",
          example: "afjadsjcioajvasfjaisfojasdkvjais"
        }
      }
    }
  }
  */
);

export default router;
