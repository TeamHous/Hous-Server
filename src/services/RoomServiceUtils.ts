import mongoose from 'mongoose';
import errorGenerator from '../errors/errorGenerator';
import Room from '../models/Room';
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

const findRoomById = async (roomId: string) => {
  const room = await Room.findById(roomId);
  if (!room) {
    throw errorGenerator({
      msg: message.NOT_FOUND_ROOM,
      statusCode: statusCode.NOT_FOUND
    });
  }
  return room;
};

const checkJoinedRoomId = (roomId: mongoose.Types.ObjectId) => {
  if (roomId != undefined && roomId != null) {
    throw errorGenerator({
      msg: message.CONFLICT_JOINED_ROOM,
      statusCode: statusCode.CONFLICT
    });
  }
};

export default {
  findUserById,
  findRoomById,
  checkJoinedRoomId
};
