import { NextFunction, Request, Response } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';
import { HomieResponseDto } from '../interfaces/user/HomieResponseDto';
import { UserModifyResponseDto } from '../interfaces/user/UserModifyResponseDto';
import { UserProfileResponseDto } from '../interfaces/user/UserProfileResponseDto';
import { UserSettingResponseDto } from '../interfaces/user/UserSettingResponseDto';
import { UserUpdateDto } from '../interfaces/user/UserUpdateDto';
import { UserUpdateResponseDto } from '../interfaces/user/UserUpdateResponseDto';
import { UserNotificationUpdateDto } from '../interfaces/user/UsuerNotificationStateUpdateDto';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { UserService } from '../services';

/**
 * @route GET /user/profile
 * @desc Read User information at profile home View
 * @access Private
 */
const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const userId: string = req.body.user._id;

  try {
    const data: UserProfileResponseDto = await UserService.getUserAtHome(
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
 * @route POST /user/profile/me
 * @desc Read User information at profile modify View
 * @access Private
 */
const getUserAtModify = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const userId: string = req.body.user._id;

  try {
    const data: UserModifyResponseDto = await UserService.getUserAtModify(
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
      .send(
        util.success(statusCode.OK, message.READ_USER_SETTING_SUCCESS, data)
      );
  } catch (error) {
    next(error);
  }
};

/**
 * @route PUT /user/setting/notification
 * @desc update user notification state
 * @access Private
 */
const updateUserNotificationState = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const userId: string = req.body.user._id;
  try {
    const data: UserNotificationUpdateDto =
      await UserService.updateUserNotificationState(userId);

    return res
      .status(statusCode.OK)
      .send(
        util.success(
          statusCode.OK,
          message.UPDATE_USER_NOTIFICATION_STATE_SUCCESS,
          data
        )
      );
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
  getUserAtHome,
  getUserAtModify,
  updateUser,
  getUserSetting,
  getHomieProfile,
  updateUserNotificationState
};
