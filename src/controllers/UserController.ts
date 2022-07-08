import { NextFunction, Request, Response } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';
import { UserResponseDto } from '../interfaces/user/UserResponseDto';
import { UserUpdateDto } from '../interfaces/user/UserUpdateDto';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { UserService } from '../services';

/**
 * @route GET /user/profile/me
 * @desc select user information
 * @access Private
 */
const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const userId: string = req.body.user._id;

  try {
    const result: UserResponseDto = await UserService.getUser(userId);

    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.READ_USER_SUCCESS, result));
  } catch (error) {
    next(error);
  }
};
/**
 * @route POST /user/profile/me
 * @desc update user information
 * @access Private
 */
const updateUser = async (
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

  const userUpdateDto: UserUpdateDto = req.body;
  const userId: string = req.body.user._id;

  try {
    await UserService.updateUser(userId, userUpdateDto);

    return res.status(statusCode.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

export default {
  getUser,
  updateUser
};
