import bcrypt from 'bcryptjs';
import errorGenerator from '../errors/errorGenerator';
import { LoginDto } from '../interfaces/auth/LoginDto';
import { PostBaseResponseDto } from '../interfaces/common/PostBaseResponseDto';
import User from '../models/User';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';

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
        statusCode: statusCode.NOT_FOUND
      });

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch)
      throw errorGenerator({
        msg: message.INVALID_PASSWORD,
        statusCode: statusCode.UNAUTHORIZED
      });

    user.fcmToken = loginDto.fcmToken;

    const data: PostBaseResponseDto = {
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
