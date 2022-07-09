import dayjs from 'dayjs';
import errorGenerator from '../errors/errorGenerator';
import { PostBaseResponseDto } from '../interfaces/common/PostBaseResponseDto';
import { RoomJoinDto } from '../interfaces/room/RoomJoinDto';
import { RoomJoinResponseDto } from '../interfaces/room/RoomJoinResponseDto';
import { RoomResponseDto } from '../interfaces/room/RoomResponseDto';
import Event from '../models/Event';
import Room from '../models/Room';
import RuleCategory from '../models/RuleCategory';
import User from '../models/User';
import checkObjectIdValidation from '../modules/checkObjectIdValidation';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import RoomServiceUtils from './RoomServiceUtils';

const createRoom = async (userId: string): Promise<RoomResponseDto> => {
  try {
    const user = await RoomServiceUtils.findUserById(userId);

    if (user.roomId != undefined && user.roomId != null) {
      throw errorGenerator({
        msg: message.CONFLICT_JOINED_ROOM,
        statusCode: statusCode.CONFLICT
      });
    }

    const room = new Room({
      roomOwner: userId,
      roomCode: await createRoomCode()
    });

    await room.save();

    await User.findByIdAndUpdate(userId, {
      roomId: room._id
    });

    const ruleCategory = new RuleCategory({
      roomId: room._id,
      categoryName: '청소',
      categoryIcon: 'CLEAN'
    });

    await ruleCategory.save();

    const event = new Event({
      roomId: room._id,
      eventName: '여기에 이벤트를 추가하세요.',
      eventIcon: 'PARTY',
      date: dayjs().add(10, 'day'), // 오늘 + 10일
      participantsId: [user._id]
    });

    await event.save();

    const data: RoomResponseDto = {
      _id: room._id,
      roomCode: room.roomCode
    };

    return data;
  } catch (error) {
    throw error;
  }
};

const getRoomAndUserByRoomCode = async (
  userId: string,
  roomJoinDto: RoomJoinDto
): Promise<RoomJoinResponseDto> => {
  try {
    let user = await RoomServiceUtils.findUserById(userId);

    user = await user.populate('typeId', 'typeColor');

    if (user.roomId != undefined && user.roomId != null) {
      throw errorGenerator({
        msg: message.CONFLICT_JOINED_ROOM,
        statusCode: statusCode.CONFLICT
      });
    }

    const room = await Room.findOne({
      roomCode: roomJoinDto.roomCode
    });
    if (!room) {
      throw errorGenerator({
        msg: message.NOT_FOUND_ROOM,
        statusCode: statusCode.NOT_FOUND
      });
    }

    const data: RoomJoinResponseDto = {
      _id: room._id,
      typeColor: (user.typeId as any).typeColor,
      userName: user.userName,
      introduction: user.introduction
    };

    return data;
  } catch (error) {
    throw error;
  }
};

const joinRoom = async (
  userId: string,
  roomId: string,
  roomJoinDto: RoomJoinDto
): Promise<PostBaseResponseDto> => {
  try {
    checkObjectIdValidation(roomId);

    const user = await RoomServiceUtils.findUserById(userId);
    if (user.roomId != undefined && user.roomId != null)
      throw errorGenerator({
        msg: message.CONFLICT_JOINED_ROOM,
        statusCode: statusCode.CONFLICT
      });

    const room = await Room.findOne({
      _id: roomId,
      roomCode: roomJoinDto.roomCode
    });
    if (!room)
      throw errorGenerator({
        msg: message.NOT_FOUND_ROOM,
        statusCode: statusCode.NOT_FOUND
      });

    await User.findByIdAndUpdate(userId, {
      $set: {
        roomId: room._id
      }
    });

    const data: PostBaseResponseDto = {
      _id: room._id
    };

    return data;
  } catch (error) {
    throw error;
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

export default {
  createRoom,
  getRoomAndUserByRoomCode,
  joinRoom
};
