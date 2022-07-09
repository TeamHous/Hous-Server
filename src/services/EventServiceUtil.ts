import errorGenerator from '../errors/errorGenerator';
import Room from '../models/Room';
import User from '../models/User';
import { IconTypeArray } from '../modules/IconType';
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

const isIconType = (iconType: string) => {
  if (IconTypeArray.indexOf(iconType) == -1) {
    throw errorGenerator({
      msg: message.INVALID_ICON_ENUM,
      statusCode: statusCode.BAD_REQUEST
    });
  }
};

export default {
  findUserById,
  findRoomById,
  isIconType
};