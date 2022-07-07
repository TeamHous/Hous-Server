import bcrypt from 'bcryptjs';
import errorGenerator from '../errors/errorGenerator';
import { LoginDto } from '../interfaces/auth/LoginDto';
import { PostBaseResponseDto } from '../interfaces/common/PostBaseResponseDto';
import User from '../models/User';
import message from '../modules/responseMessage';

const login = async (loginDto: LoginDto): Promise<PostBaseResponseDto> => {
  try {
    const user = await User.findOneAndUpdate(
      {
        email: loginDto.email
      },
      {
        $set: {
          fcmToken: loginDto.fcmToken
        }
      }
    );
    if (!user)
      throw errorGenerator({
        msg: message.NOT_FOUND_USER_EMAIL,
        statusCode: 404
      });

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch)
      throw errorGenerator({ msg: message.INVALID_PASSWORD, statusCode: 401 });

    user.fcmToken = loginDto.fcmToken;

    const data = {
      _id: user._id
    };

    return data;
  } catch (error) {
    throw error;
  }
};

export default {
  login
};
