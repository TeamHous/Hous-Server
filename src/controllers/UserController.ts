import { NextFunction, Request, Response } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';
import { HomieResponseDto } from '../interfaces/user/HomieResponseDto';
import { UserResponseDto } from '../interfaces/user/UserResponseDto';
import { UserSettingResponseDto } from '../interfaces/user/UserSettingResponseDto';
import { UserUpdateDto } from '../interfaces/user/UserUpdateDto';
import { UserUpdateResponseDto } from '../interfaces/user/UserUpdateResponseDto';
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
    const data: UserResponseDto = await UserService.getUser(userId);

    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.READ_USER_SUCCESS, data));
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
    const data: UserUpdateResponseDto = await UserService.updateUser(
      userId,
      userUpdateDto
    );

    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.UPDATE_USER_SUCCESS, data));
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /user/setting
 * @desc get user setting
 * @access Private
 */
const getUserSetting = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const userId: string = req.body.user._id;
  try {
    const data: UserSettingResponseDto = await UserService.getUserSetting(
      userId
    );

    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.READ_USER_SUCCESS, data));
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /user/:homieId
 * @desc get homie profile
 * @access Private
 */
const getHomieProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const userId: string = req.body.user._id;
  const { homieId } = req.params;
  try {
    const data: HomieResponseDto = await UserService.getHomieProfile(
      userId,
      homieId
    );
    return res
      .status(statusCode.OK)
      .send(
        util.success(statusCode.OK, message.READ_HOMIE_PROFILE_SUCCESS, data)
      );
  } catch (error) {
    next(error);
  }
};

export default {
  getUser,
  updateUser,
  getUserSetting,
  getHomieProfile
};
