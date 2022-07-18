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
  // #swagger.summary = '회원가입'
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
  /*
  #swagger.responses[201] = {
    schema: {
      status: 201,
      success: true,
      message: '회원가입 성공입니다.',
      data: 'jwt'
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
  // #swagger.summary = '로그인'
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
  /*
  #swagger.responses[200] = {
    schema: {
      status: 200,
      success: true,
      message: '로그인 성공입니다.',
      data: 'jwt'
    }
  }
  */
);

export default router;
