import { NextFunction, Request, Response } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';
import { LoginDto } from '../interfaces/auth/LoginDto';
import { SignupDto } from '../interfaces/auth/SignupDto';
import { PostBaseResponseDto } from '../interfaces/common/PostBaseResponseDto';
import getToken from '../modules/jwtHandler';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { AuthService, UserService } from '../services';

/**
 *  @route POST /auth/signup
 *  @desc signup Create User
 *  @access Public
 */
const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(
        util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST, errors.array())
      );
  }

  const signupDto: SignupDto = req.body;
  try {
    const result: PostBaseResponseDto = await UserService.createUser(signupDto);

    const accessToken: string = getToken(result._id);

    return res
      .status(statusCode.CREATED)
      .send(
        util.success(statusCode.CREATED, message.SIGNUP_SUCCESS, accessToken)
      );
  } catch (error) {
    next(error);
  }
};

/**
 * @route POST /auth/login
 * @desc login
 * @access Public
 */
const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(
        util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST, errors.array())
      );
  }

  const LoginDto: LoginDto = req.body;

  try {
    const result: PostBaseResponseDto = await AuthService.login(LoginDto);

    const accessToken: string = getToken(result._id);

    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.LOGIN_SUCCESS, accessToken));
  } catch (error) {
    next(error);
  }
};

export default {
  signup,
  login
};
