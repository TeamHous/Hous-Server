import bcrypt from 'bcryptjs';
import errorGenerator from '../errors/errorGenerator';
import { SignupDto } from '../interfaces/auth/SignupDto';
import { PostBaseResponseDto } from '../interfaces/common/PostBaseResponseDto';
import { HomieResponseDto } from '../interfaces/user/HomieResponseDto';
import { UserResponseDto } from '../interfaces/user/UserResponseDto';
import { UserSettingResponseDto } from '../interfaces/user/UserSettingResponseDto';
import { UserUpdateDto } from '../interfaces/user/UserUpdateDto';
import { UserUpdateResponseDto } from '../interfaces/user/UserUpdateResponseDto';
import User from '../models/User';
import checkObjectIdValidation from '../modules/checkObjectIdValidation';
import checkValidUtils from '../modules/checkValidUtils';
import limitNum from '../modules/limitNum';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import UserServiceUtils from './UserServiceUtils';

const createUser = async (
  signupDto: SignupDto
): Promise<PostBaseResponseDto> => {
  try {
    const existUser = await User.findOne({
      email: signupDto.email
    });
    if (existUser) {
      throw errorGenerator({
        msg: message.CONFLICT_EMAIL,
        statusCode: statusCode.CONFLICT
      });
    }

    const user = new User({
      email: signupDto.email,
      password: signupDto.password,
      userName: signupDto.userName,
      gender: signupDto.gender,
      birthday: signupDto.birthday,
      fcmToken: signupDto.fcmToken,
      notificationState: true
    });

    const salt: string = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(signupDto.password, salt);

    await user.save();

    const data = {
      _id: user._id
    };

    return data;
  } catch (error) {
    throw error;
  }
};

const getUser = async (userId: string): Promise<UserResponseDto> => {
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

    const data: UserResponseDto = {
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

const updateUser = async (
  userId: string,
  userUpdateDto: UserUpdateDto
): Promise<UserUpdateResponseDto> => {
  try {
    await UserServiceUtils.findUserById(userId);

    if (Array.isArray(userUpdateDto.hashTag)) {
      checkValidUtils.checkArraySize(
        userUpdateDto.hashTag.length,
        limitNum.PROFILE_HASH_TAG_CNT
      );
      userUpdateDto.hashTag.forEach(tag => {
        checkValidUtils.checkStringLength(
          tag.length,
          limitNum.PROFILE_HASH_TAG_MAX_LENGTH
        );
      });
    }

    await User.findByIdAndUpdate(userId, userUpdateDto);
    const data: UserUpdateResponseDto = {
      userName: userUpdateDto.userName,
      job: userUpdateDto.job,
      introduction: userUpdateDto.introduction,
      hashTag: userUpdateDto.hashTag
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

    // 유저 확인
    const user = await UserServiceUtils.findUserById(userId);
    const homie = await UserServiceUtils.findUserById(homieId);

    console.log(user.roomId);
    console.log(homie.roomId);

    if (!user.roomId.equals(homie.roomId)) {
      throw errorGenerator({
        msg: message.NOT_FOUND_ROOMMATE,
        statusCode: statusCode.NOT_FOUND
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

export default {
  createUser,
  updateUser,
  getUser,
  getUserSetting,
  getHomieProfile
};
