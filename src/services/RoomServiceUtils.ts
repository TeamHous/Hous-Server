import mongoose from 'mongoose';
import errorGenerator from '../errors/errorGenerator';
import User from '../models/User';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';

const findUserById = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw errorGenerator({
      msg: message.UNAUTHORIZED,
      statusCode: statusCode.UNAUTHORIZED
    });
  }
  return user;
};

const checkExistRoomId = (roomId: mongoose.Types.ObjectId) => {
  if (roomId != undefined && roomId != null) {
    throw errorGenerator({
      msg: message.CONFLICT_JOINED_ROOM,
      statusCode: statusCode.CONFLICT
    });
  }
};

export default {
  findUserById,
  checkExistRoomId
};
