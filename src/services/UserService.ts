import bcrypt from 'bcryptjs';
import errorGenerator from '../errors/errorGenerator';
import { SignupDto } from '../interfaces/auth/SignupDto';
import { PostBaseResponseDto } from '../interfaces/common/PostBaseResponseDto';
import { UserResponseDto } from '../interfaces/user/UserResponseDto';
import { UserUpdateDto } from '../interfaces/user/UserUpdateDto';
import User from '../models/User';
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
    if (existUser)
      throw errorGenerator({
        msg: message.CONFLICT_EMAIL,
        statusCode: statusCode.CONFLICT
      });

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

const selectUser = async (userId: string): Promise<UserResponseDto[]> => {
  try {
    await UserServiceUtils.findUserById(userId);

    const userInfo = await User.find({
      _id: userId
    }).populate('typeId', 'typeName typeColor');

    if (!userInfo) throw errorGenerator({ statusCode: statusCode.NOT_FOUND });

    const data: UserResponseDto[] = userInfo.map((user: any) => {
      const result = {
        userName: user.userName,
        job: user.job,
        introduction: user.introduction,
        hashTag: user.hashTag,
        typeName: user.typeId.typeName,
        typeColor: user.typeId.typeColor,
        typeScore: user.typeScore,
        notificationState: user.notificationState
      };
      return result;
    });

    return data;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (
  userId: string,
  userUpdateDto: UserUpdateDto
): Promise<void> => {
  try {
    await UserServiceUtils.findUserById(userId);

    await User.findByIdAndUpdate(userId, userUpdateDto);
  } catch (error) {
    throw error;
  }
};

export default {
  createUser,
  updateUser,
  selectUser
};
