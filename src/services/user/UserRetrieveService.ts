import errorGenerator from '../../errors/errorGenerator';
import { HomieResponseDto } from '../../interfaces/user/response/HomieResponseDto';
import { UserModifyResponseDto } from '../../interfaces/user/response/UserModifyResponseDto';
import { UserProfileResponseDto } from '../../interfaces/user/response/UserProfileResponseDto';
import { UserSettingResponseDto } from '../../interfaces/user/response/UserSettingResponseDto';
import User from '../../models/User';
import checkObjectIdValidation from '../../modules/checkObjectIdValidation';
import message from '../../modules/responseMessage';
import statusCode from '../../modules/statusCode';
import UserServiceUtils from './UserServiceUtils';
import { TypeDetailResponseDto } from '../../interfaces/type/response/TypeDetailResponseDto';

const getUserAtHome = async (
  userId: string
): Promise<UserProfileResponseDto> => {
  try {
    await UserServiceUtils.findUserById(userId);

    const userInfo = await User.findById(userId).populate(
      'typeId',
      'typeName typeColor'
    );

    if (!userInfo) {
      throw errorGenerator({
        msg: message.NOT_FOUND_USER,
        statusCode: statusCode.NOT_FOUND
      });
    }

    const data: UserProfileResponseDto = {
      userName: userInfo.userName,
      job: userInfo.job,
      introduction: userInfo.introduction,
      hashTag: userInfo.hashTag,
      typeName: (userInfo.typeId as any).typeName,
      typeColor: (userInfo.typeId as any).typeColor,
      typeScore: userInfo.typeScore,
      notificationState: userInfo.notificationState
    };

    return data;
  } catch (error) {
    throw error;
  }
};

const getUserAtModify = async (
  userId: string
): Promise<UserModifyResponseDto> => {
  try {
    await UserServiceUtils.findUserById(userId);

    const userInfo = await User.findById(userId).populate(
      'typeId',
      'typeName typeColor'
    );

    if (!userInfo) {
      throw errorGenerator({
        msg: message.NOT_FOUND_USER,
        statusCode: statusCode.NOT_FOUND
      });
    }

    const data: UserModifyResponseDto = {
      userName: userInfo.userName,
      job: userInfo.job,
      introduction: userInfo.introduction,
      hashTag: userInfo.hashTag,
      typeName: (userInfo.typeId as any).typeName,
      typeColor: (userInfo.typeId as any).typeColor
    };

    return data;
  } catch (error) {
    throw error;
  }
};

const getUserSetting = async (
  userId: string
): Promise<UserSettingResponseDto> => {
  try {
    const user = await UserServiceUtils.findUserById(userId);

    const data: UserSettingResponseDto = {
      notificationState: user.notificationState
    };

    return data;
  } catch (error) {
    throw error;
  }
};

const getHomieProfile = async (
  userId: string,
  homieId: string
): Promise<HomieResponseDto> => {
  try {
    // ObjectId 인지 확인
    checkObjectIdValidation(userId);
    checkObjectIdValidation(homieId);

    // 유저 존재 확인
    const user = await UserServiceUtils.findUserById(userId);
    const homie = await UserServiceUtils.findUserById(homieId);

    if (!user.roomId.equals(homie.roomId)) {
      throw errorGenerator({
        msg: message.FORBIDDEN_HOMIE,
        statusCode: statusCode.FORBIDDEN
      });
    }
    const homieInfo = await User.findById(userId).populate(
      'typeId',
      'typeName typeColor'
    );

    if (!homieInfo) {
      throw errorGenerator({
        msg: message.NOT_FOUND_USER,
        statusCode: statusCode.NOT_FOUND
      });
    }

    const data: HomieResponseDto = {
      userName: homieInfo.userName,
      job: homieInfo.job,
      introduction: homieInfo.introduction,
      hashTag: homieInfo.hashTag,
      typeName: (homieInfo.typeId as any).typeName,
      typeColor: (homieInfo.typeId as any).typeColor,
      typeScore: homieInfo.typeScore
    };
    return data;
  } catch (error) {
    throw error;
  }
};

const getTypeDetail = async (
  userId: string
): Promise<TypeDetailResponseDto> => {
  try {
    // ObjectId 인지 확인
    checkObjectIdValidation(userId);
    // 유저 존재 확인
    const user = await UserServiceUtils.findUserById(userId);
    // 성향 존재 확인
    const typeDetail = await UserServiceUtils.findTypeById(
      user.typeId.toString()
    );

    const data: TypeDetailResponseDto = {
      typeName: typeDetail.typeName,
      typeColor: typeDetail.typeColor,
      typeImg: typeDetail.typeImg,
      typeOneComment: typeDetail.typeOneComment,
      typeDesc: typeDetail.typeDesc,
      typeRulesTitle: typeDetail.typeRulesTitle,
      typeRules: typeDetail.typeRules,
      good: typeDetail.good,
      bad: typeDetail.bad
    };

    return data;
  } catch (error) {
    throw error;
  }
};

export default {
  getUserAtHome,
  getUserAtModify,
  getUserSetting,
  getHomieProfile,
  getTypeDetail
};
