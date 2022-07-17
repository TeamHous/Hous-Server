import { NextFunction, Request, Response } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';
import { TypeTestDto } from '../interfaces/type/request/TypeTestDto';
import { TypeDetailResponseDto } from '../interfaces/type/response/TypeDetailResponseDto';
import { UserUpdateDto } from '../interfaces/user/request/UserUpdateDto';
import { HomieResponseDto } from '../interfaces/user/response/HomieResponseDto';
import { UserModifyResponseDto } from '../interfaces/user/response/UserModifyResponseDto';
import {
  UserNotificationUpdateDto,
  UserNotificationUpdateResponseDto
} from '../interfaces/user/response/UserNotificationStateUpdateDto';
import { UserProfileResponseDto } from '../interfaces/user/response/UserProfileResponseDto';
import { UserSettingResponseDto } from '../interfaces/user/response/UserSettingResponseDto';
import { UserUpdateResponseDto } from '../interfaces/user/response/UserUpdateResponseDto';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { UserService } from '../services';
import UserRetrieveService from '../services/user/UserRetrieveService';

/**
 * @route GET /user/profile
 * @desc Read User information at profile home View
 * @access Private
 */
const getUserAtHome = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const userId: string = req.body.user._id;

  try {
    const data: UserProfileResponseDto =
      await UserRetrieveService.getUserAtHome(userId);

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
    const data: UserModifyResponseDto =
      await UserRetrieveService.getUserAtModify(userId);

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
    const data: UserSettingResponseDto =
      await UserRetrieveService.getUserSetting(userId);

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
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(
        util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST, errors.array())
      );
  }

  const userId: string = req.body.user._id;
  const userNotificationStateUpdateDto: UserNotificationUpdateDto = req.body;

  try {
    const data: UserNotificationUpdateResponseDto =
      await UserService.updateUserNotificationState(
        userId,
        userNotificationStateUpdateDto
      );

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
    const data: HomieResponseDto = await UserRetrieveService.getHomieProfile(
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

/**
 * @route PUT /user/type/test
 * @desc Update user type test
 * @access Private
 */
const updateUserTypeScore = async (
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

  const userId: string = req.body.user._id;
  const userTypeTestDto: TypeTestDto = req.body;

  try {
    const data: TypeTestDto = await UserService.updateUserTypeScore(
      userId,
      userTypeTestDto
    );

    return res
      .status(statusCode.OK)
      .send(
        util.success(statusCode.OK, message.UPDATE_USER_TEST_TYPE_SUCCESS, data)
      );
  } catch (error) {
    next(error);
  }
};

/**
 * @route DELETE /user
 * @desc Delete user
 * @access Private
 */
const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const userId: string = req.body.user._id;
  try {
    await UserService.deleteUser(userId);

    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.DELETE_USER_SUCCESS, null));
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /user/me/type/:typeId
 * @desc Get my type detail
 * @access Private
 */
const getMyTypeDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const userId: string = req.body.user._id;
  try {
    const data: TypeDetailResponseDto = await UserRetrieveService.getTypeDetail(
      userId
    );

    return res
      .status(statusCode.OK)
      .send(
        util.success(statusCode.OK, message.GET_USER_TYPE_DETAIL_SUCCESS, data)
      );
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /user/:userId/type/:typeId
 * @desc Get homie type detail
 * @access Private
 */
const getHomieTypeDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const { userId } = req.params;
  try {
    const data: TypeDetailResponseDto = await UserRetrieveService.getTypeDetail(
      userId
    );

    return res
      .status(statusCode.OK)
      .send(
        util.success(statusCode.OK, message.GET_USER_TYPE_DETAIL_SUCCESS, data)
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
  updateUserNotificationState,
  updateUserTypeScore,
  deleteUser,
  getMyTypeDetail,
  getHomieTypeDetail
};
