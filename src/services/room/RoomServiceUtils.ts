import dayjs from 'dayjs';
import mongoose from 'mongoose';
import errorGenerator from '../../errors/errorGenerator';
import { TodoWithDate } from '../../interfaces/room/response/HomeResponseDto';
import Check from '../../models/Check';
import Room from '../../models/Room';
import User from '../../models/User';
import message from '../../modules/responseMessage';
import statusCode from '../../modules/statusCode';

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

const checkForbiddenRoom = async (
  userRoomId: mongoose.Types.ObjectId,
  roomId: mongoose.Types.ObjectId
) => {
  if (!roomId.equals(userRoomId)) {
    throw errorGenerator({
      msg: message.FORBIDDEN_ROOM,
      statusCode: statusCode.FORBIDDEN
    });
  }
};

const createRoomCode = async (): Promise<string> => {
  const size: number = 8;
  const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength: number = characters.length;
  let result: string = '';
  do {
    result = '';
    for (let i: number = 0; i < size; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  } while (await duplicateRoomCode(result));

  return result;
};

const duplicateRoomCode = async (roomCode: string): Promise<boolean> => {
  const room = await Room.findOne({ roomCode: roomCode });
  if (!room) return false;
  else return true;
};

const checkTodoListForCheckStatus = async (
  rule: any,
  userId: string
): Promise<TodoWithDate> => {
  let checkStatus: boolean;
  const checks = await Check.find({
    ruleId: rule._id,
    userId: userId
  });

  let isChecked: boolean = false;

  for (const check of checks) {
    if (dayjs().isSame(check.date, 'day')) {
      isChecked = true;
      break;
    }
  }

  return {
    isChecked: isChecked,
    ruleName: rule.ruleName,
    createdAt: rule.createdAt
  };
};

export default {
  findUserById,
  findRoomById,
  checkJoinedRoomId,
  checkForbiddenRoom,
  createRoomCode,
  checkTodoListForCheckStatus
};
