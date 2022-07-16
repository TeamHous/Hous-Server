import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';
import errorGenerator from '../../errors/errorGenerator';
import { SignupDto } from '../../interfaces/auth/SignupDto';
import { PostBaseResponseDto } from '../../interfaces/common/PostBaseResponseDto';
import {
  UserNotificationUpdateDto,
  UserNotificationUpdateResponseDto
} from '../../interfaces/user/UserNotificationStateUpdateDto';
import { UserTypeTestDto } from '../../interfaces/user/UserTypeTestDto';
import { UserTypeTestResponseDto } from '../../interfaces/user/UserTypeTestResponseDto';
import { UserUpdateDto } from '../../interfaces/user/UserUpdateDto';
import { UserUpdateResponseDto } from '../../interfaces/user/UserUpdateResponseDto';
import User from '../../models/User';
import checkValidUtils from '../../modules/checkValidUtils';
import limitNum from '../../modules/limitNum';
import message from '../../modules/responseMessage';
import statusCode from '../../modules/statusCode';
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
      birthday: dayjs(signupDto.birthday).format('YYYY-MM-DD'),
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

const updateUserNotificationState = async (
  userId: string,
  userNotificationStateUpdateDto: UserNotificationUpdateDto
): Promise<UserNotificationUpdateResponseDto> => {
  try {
    const user = await UserServiceUtils.findUserById(userId);

    if (
      user.notificationState ===
      userNotificationStateUpdateDto.notificationState
    ) {
      throw errorGenerator({
        msg: message.BAD_REQUEST,
        statusCode: statusCode.BAD_REQUEST
      });
    }

    await user.updateOne(userNotificationStateUpdateDto);

    const data: UserNotificationUpdateResponseDto = {
      notificationState: userNotificationStateUpdateDto.notificationState
    };
    return data;
  } catch (error) {
    throw error;
  }
};

const updateUserTypeScore = async (
  userId: string,
  userTypeTestDto: UserTypeTestDto
): Promise<UserTypeTestResponseDto> => {
  try {
    const user = await UserServiceUtils.findUserById(userId);

    if (userTypeTestDto.typeScore.length !== 5) {
      throw errorGenerator({
        statusCode: statusCode.BAD_REQUEST,
        msg: message.BAD_REQUEST
      });
    }

    // 각 문제 타입당 3문제씩
    userTypeTestDto.typeScore.forEach(score => {
      if (score > 9 || score < 3) {
        throw errorGenerator({
          statusCode: statusCode.BAD_REQUEST,
          msg: message.BAD_REQUEST
        });
      }
    });

    await user.updateOne({ typeScore: userTypeTestDto.typeScore });

    const data: UserTypeTestResponseDto = {
      _id: user._id,
      typeScore: userTypeTestDto.typeScore
    };

    return data;
  } catch (error) {
    throw error;
  }
};

export default {
  createUser,
  updateUser,
  updateUserNotificationState,
  updateUserTypeScore
};
