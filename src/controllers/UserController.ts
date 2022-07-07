import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import errorGenerator from '../error/errorGenerator';
import { PostBaseResponseDto } from '../interfaces/common/PostBaseResponseDto';
import { UserCreateDto } from '../interfaces/user/UserCreateDto';
import { UserSignInDto } from '../interfaces/user/UserSignInDto';
import getToken from '../modules/jwtHandler';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { UserService } from '../services';

/**
 *  @route POST /user
 *  @desc Create User
 *  @access Public
 */
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      errorGenerator({ statusCode: 400 });
    }

    const userCreateDto: UserCreateDto = req.body; // User Create Dto 로 req.body 받아옴
    const result = await UserService.createUser(userCreateDto);
    if (!result) errorGenerator({ statusCode: 409 });

    const accessToken = getToken(result._id);

    const data = {
      _id: result._id,
      accessToken
    };

    res.status(statusCode.CREATED).send(util.success(statusCode.CREATED, message.CREATE_USER_SUCCESS, data));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 * @route POST /user/signin
 * @desc sign in User
 * @access Public
 */
const signInUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      errorGenerator({ statusCode: 400 });
    }

    const userSignInDto: UserSignInDto = req.body;
    const result = await UserService.signInUser(userSignInDto);

    if (!result) errorGenerator({ statusCode: 404 });

    const accessToken = getToken((result as PostBaseResponseDto)._id);

    const data = {
      _id: (result as PostBaseResponseDto)._id,
      accessToken
    };

    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SIGNIN_USER_SUCCESS, data));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default {
  createUser,
  signInUser
};
