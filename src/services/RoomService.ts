import errorGenerator from '../errors/errorGenerator';
import { PostBaseResponseDto } from '../interfaces/common/PostBaseResponseDto';
import Room from '../models/Room';
import User from '../models/User';
import message from '../modules/responseMessage';

const createRoom = async (userId: string): Promise<PostBaseResponseDto> => {
  try {
    const user = await User.findById(userId);
    if (!user) throw errorGenerator({ statusCode: 401 });

    if (user.roomId == undefined || user.roomId == null)
      throw errorGenerator({
        msg: message.CONFLICT_JOINED_ROOM,
        statusCode: 409
      });

    const room = new Room({
      roomCode: await createRoomCode(),
      usersId: [userId]
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
  createRoom
};
