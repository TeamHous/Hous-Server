import dayjs from 'dayjs';
import errorGenerator from '../errors/errorGenerator';
import { PostBaseResponseDto } from '../interfaces/common/PostBaseResponseDto';
import {
  EventsInfo,
  HomeResponseDto,
  HomieProfile,
  TodoInfo
} from '../interfaces/room/HomeResponseDto';
import { RoomJoinDto } from '../interfaces/room/RoomJoinDto';
import { RoomJoinResponseDto } from '../interfaces/room/RoomJoinResponseDto';
import { RoomResponseDto } from '../interfaces/room/RoomResponseDto';
import Check from '../models/Check';
import Event from '../models/Event';
import Room from '../models/Room';
import Rule from '../models/Rule';
import RuleCategory from '../models/RuleCategory';
import User from '../models/User';
import checkObjectIdValidation from '../modules/checkObjectIdValidation';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import RoomServiceUtils from './RoomServiceUtils';
import RuleServiceUtils from './RuleServiceUtils';

const createRoom = async (userId: string): Promise<RoomResponseDto> => {
  try {
    const user = await RoomServiceUtils.findUserById(userId);

    RoomServiceUtils.checkExistRoomId(user.roomId);

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

    RoomServiceUtils.checkExistRoomId(user.roomId);

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

    RoomServiceUtils.checkExistRoomId(user.roomId);

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

const getRoomInfoAtHome = async (
  userId: string,
  roomId: string
): Promise<HomeResponseDto> => {
  try {
    // ObjectId 형식인지 확인
    checkObjectIdValidation(roomId);

    // 존재하는 id인지 확인
    await RuleServiceUtils.findUserById(userId);
    const room = await Room.findById(roomId);
    if (!room) {
      throw errorGenerator({
        msg: message.NOT_FOUND_ROOM,
        statusCode: statusCode.NOT_FOUND
      });
    }

    // KeyRules 조회
    const tmpKeyRulesList = await Rule.find({
      roomId: roomId,
      isKeyRules: true
    });

    const keyRulesList: string[] = await Promise.all(
      tmpKeyRulesList.map(async (KeyRules: any) => {
        return KeyRules;
      })
    );

    // Events 조회
    const tmpEventList = await Event.find({
      roomId: roomId,
      date: { $gt: dayjs().subtract(9, 'hour') }
    });

    const eventList: EventsInfo[] = await Promise.all(
      tmpEventList.map(async (event: any) => {
        const nowEventDate = dayjs(event.date);
        const todayDate = dayjs();
        const eventDday = nowEventDate.diff(todayDate, 'day');
        const result = {
          eventId: event._id,
          eventName: event.eventName,
          eventIcon: event.eventIcon,
          dDay: eventDday.toString()
        };
        return result;
      })
    );

    // Homie 조회
    const tmpHomies = await User.find({
      roomId: roomId
    }).populate('typeId', 'typeName typeColor');

    const homies: HomieProfile[] = await Promise.all(
      tmpHomies.map(async (homie: any) => {
        const result = {
          homieId: homie._id,
          userName: homie.userName,
          typeName: homie.typeId.typeName,
          typeColor: homie.typeId.typeColor
        };
        return result;
      })
    );

    // to-do 체크 여부 포함 조회
    const tmpRuleList = await Rule.find({
      roomId: roomId
    }).sort({ createdAt: 'asc' });

    const todoInfoList: TodoInfo[] = await Promise.all(
      tmpRuleList.map(async (rule: any) => {
        const isCheck = await Check.findOne({
          ruleId: rule._id,
          userId: userId
        });

        if (!isCheck) {
          return {
            isCheck: false,
            todo: rule.ruleName
          };
        } else {
          const isCheckDate = dayjs(isCheck.date);
          const check: boolean = isCheckDate.isSame(dayjs().add(9, 'hour'))
            ? true
            : false;
          return {
            isCheck: check,
            todo: rule.ruleName
          };
        }
      })
    );

    const data: HomeResponseDto = {
      eventList: eventList,
      keyRulesList: keyRulesList,
      todoList: todoInfoList,
      homieProfileList: homies,
      roomCode: room.roomCode
    };

    return data;
  } catch (error) {
    throw error;
  }
};

export default {
  createRoom,
  getRoomAndUserByRoomCode,
  joinRoom,
  getRoomInfoAtHome
};
