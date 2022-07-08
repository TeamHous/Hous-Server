import errorGenerator from '../errors/errorGenerator';
import { PostBaseResponseDto } from '../interfaces/common/PostBaseResponseDto';
import { CreateRoomDto } from '../interfaces/room/CreateRoomDto';
import { JoinRoomDto } from '../interfaces/room/JoinRoomDto';
import Room from '../models/Room';
import User from '../models/User';
import checkObjectIdValidation from '../modules/checkObjectIdValidation';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import RoomServiceUtils from './RoomServiceUtils';

const createRoom = async (
  userId: string,
  createRoomDto: CreateRoomDto
): Promise<PostBaseResponseDto> => {
  try {
    const user = await RoomServiceUtils.findUserById(userId);

    if (user.roomId != undefined && user.roomId != null)
      throw errorGenerator({
        msg: message.CONFLICT_JOINED_ROOM,
        statusCode: statusCode.CONFLICT
      });

    const room = new Room({
      roomName: createRoomDto.roomName,
      roomCode: await createRoomCode()
    });

    await room.save();

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

const joinRoom = async (
  userId: string,
  roomId: string,
  joinRoomDto: JoinRoomDto
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
      roomCode: joinRoomDto.roomCode
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
  joinRoom
};
