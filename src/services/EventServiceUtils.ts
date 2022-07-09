import errorGenerator from '../errors/errorGenerator';
import Event from '../models/Event';
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

const findEventById = async (eventId: string) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw errorGenerator({
      msg: message.NOT_FOUND_ROOM,
      statusCode: statusCode.NOT_FOUND
    });
  }
  return event;
};

export default {
  findUserById,
  findRoomById,
  findEventById
};
