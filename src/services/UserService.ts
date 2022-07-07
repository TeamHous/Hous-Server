import bcrypt from 'bcryptjs';
import errorGenerator from '../errors/errorGenerator';
import { SignupDto } from '../interfaces/auth/SignupDto';
import { PostBaseResponseDto } from '../interfaces/common/PostBaseResponseDto';
import { UserUpdateDto } from '../interfaces/user/UserUpdateDto';
import User from '../models/User';

const createUser = async (
  signupDto: SignupDto
): Promise<PostBaseResponseDto> => {
  try {
    const existUser = await User.findOne({
      email: signupDto.email
    });
    if (existUser)
      throw errorGenerator({ msg: '이메일 중복입니다.', statusCode: 409 });

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

const updateUser = async (
  userId: string,
  userUpdateDto: UserUpdateDto
): Promise<void> => {
  try {
    const user = await User.findById(userId);
    if (!user) throw errorGenerator({ statusCode: 401 });

    await User.findByIdAndUpdate(userId, userUpdateDto);
  } catch (error) {
    throw error;
  }
};

export default {
  createUser,
  updateUser
};
