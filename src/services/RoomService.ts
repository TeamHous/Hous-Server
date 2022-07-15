import dayjs from 'dayjs';
import mongoose from 'mongoose';
import errorGenerator from '../errors/errorGenerator';
import { PostBaseResponseDto } from '../interfaces/common/PostBaseResponseDto';
import {
  EventsResponseDto,
  HomeResponseDto,
  HomieProfileResponseDto,
  TodoResponseDto,
  TodoWithDate
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

const getRoom = async (
  userId: string
): Promise<mongoose.Types.ObjectId | null> => {
  try {
    const user = await RoomServiceUtils.findUserById(userId);

    let data: mongoose.Types.ObjectId | null;
    if (user.roomId != undefined && user.roomId != null) {
      data = user.roomId;
    } else {
      data = null;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

const createRoom = async (userId: string): Promise<RoomResponseDto> => {
  try {
    const user = await RoomServiceUtils.findUserById(userId);

    RoomServiceUtils.checkJoinedRoomId(user.roomId);

    const room = new Room({
      roomOwner: userId,
      roomCode: await createRoomCode()
    });

    await room.save();

    await User.findByIdAndUpdate(userId, {
      roomId: room._id
    });

    let ruleCategory = new RuleCategory({
      roomId: room._id,
      categoryName: '청소',
      categoryIcon: 'CLEAN'
    });

    ruleCategory = await ruleCategory.save();

    // 가이드용 이벤트 생성
    const event = new Event({
      roomId: room._id,
      eventName: '여기에 이벤트를 추가하세요.',
      eventIcon: 'PARTY',
      date: dayjs().add(10, 'day').format('YYYY-MM-DD'), // 오늘 + 10일
      participantsId: [user._id]
    });

    await event.save();

    // 가이드용 규칙 생성
    const keyRule = new Rule({
      roomId: room._id,
      categoryId: ruleCategory._id,
      ruleName: '설거지는 먹고 바로하기',
      ruleMembers: [],
      tmpRuleMembers: [],
      isKeyRules: true,
      notificationState: false,
      tmpUpdatedDate: dayjs().subtract(10, 'day').format('YYYY-MM-DD')
    });

    const rule = new Rule({
      roomId: room._id,
      categoryId: ruleCategory._id,
      ruleName: '화장실 청소',
      ruleMembers: [
        {
          userId: null,
          day: [0, 1, 2, 3, 4, 5, 6]
        }
      ],
      tmpRuleMembers: [],
      isKeyRules: false,
      notificationState: true,
      tmpUpdatedDate: dayjs().subtract(10, 'day').format('YYYY-MM-DD')
    });

    await keyRule.save();
    await rule.save();

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

    RoomServiceUtils.checkJoinedRoomId(user.roomId);

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

    RoomServiceUtils.checkJoinedRoomId(user.roomId);

    const room = await Room.findOne({
      _id: roomId,
      roomCode: roomJoinDto.roomCode
    });

    if (!room) {
      throw errorGenerator({
        msg: message.NOT_FOUND_ROOM,
        statusCode: statusCode.NOT_FOUND
      });
    }

    await user.updateOne({ roomId: room._id });

    await room.updateOne({ userCnt: room.userCnt + 1 });

    const data: PostBaseResponseDto = {
      _id: room._id
    };

    return data;
  } catch (error) {
    throw error;
  }
};

const leaveRoom = async (userId: string, roomId: string): Promise<void> => {
  try {
    checkObjectIdValidation(roomId);

    const user = await RoomServiceUtils.findUserById(userId);

    const room = await RoomServiceUtils.findRoomById(roomId);

    await RoomServiceUtils.checkForbiddenRoom(user.roomId, room._id);

    // user의 Check 삭제
    await Check.deleteMany({ userId: user._id });

    // user가 담당자인 Rule 담당 해제
    await Rule.updateMany(
      { roomId: room._id, 'ruleMembers.userId': user._id },
      {
        $set: {
          'ruleMembers.$.userId': null
        }
      }
    );

    // user가 포함된 Event user 제외, user가 없다면 Event 삭제
    await Event.updateMany(
      { roomId: room._id },
      {
        $pullAll: {
          participantsId: [user._id]
        }
      }
    );
    const deletedEvent = await Event.deleteMany({
      roomId: room._id,
      participantsId: { $size: 0 }
    });
    await room.updateOne({
      eventCnt: room.eventCnt - deletedEvent.deletedCount
    });

    await user.updateOne({ roomId: null });

    await room.updateOne({ userCnt: room.userCnt - 1 });

    // 퇴사한 유저가 방장이라면 방에 남은 유저에게 방장 위임
    const otherUser = await User.findOne({ roomId: room._id });

    if (room.roomOwner.equals(user._id)) {
      if (otherUser != null) {
        await room.updateOne({ roomOwner: otherUser._id });
      }
    }
    // Room에 남은 유저가 없다면 Room과 관련 데이터 전부 삭제
    if (otherUser == null) {
      await Event.deleteMany({ roomId: room._id });
      await Rule.deleteMany({ roomId: room._id });
      await RuleCategory.deleteMany({ roomId: room._id });
      await room.deleteOne();
    }
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

    // 존재하는 room인지 확인
    const room = await RoomServiceUtils.findRoomById(roomId);

    // KeyRules 조회
    const tmpKeyRulesList = await Rule.find({
      roomId: roomId,
      isKeyRules: true
    }).sort({ createdAt: 'asc' });

    const keyRulesList: string[] = await Promise.all(
      tmpKeyRulesList.map(async (keyRule: any) => {
        return keyRule.ruleName;
      })
    );

    // Events 조회
    const tmpEventList = await Event.find({
      roomId: roomId,
      date: { $gt: dayjs() }
    });

    const eventList: EventsResponseDto[] = await Promise.all(
      tmpEventList.map(async (event: any) => {
        const nowEventDate = dayjs(event.date);
        const todayDate = dayjs();
        const eventDday = nowEventDate.diff(todayDate, 'day');
        const result = {
          _id: event._id,
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

    const homies: HomieProfileResponseDto[] = await Promise.all(
      tmpHomies.map(async (homie: any) => {
        const result = {
          _id: homie._id,
          userName: homie.userName,
          typeName: homie.typeId.typeName,
          typeColor: homie.typeId.typeColor
        };
        return result;
      })
    );

    // to-do 체크 여부 포함 조회
    const today = dayjs().day();
    const tmpRuleList = await Rule.find({
      roomId: roomId,
      isKeyRules: false
    });

    // 1. 고정담당자가 '나'인데 '오늘'인 경우, 규칙 목록을 체크 여부와 함께 전달
    const todoRuleMembers: TodoWithDate[] = [];
    await Promise.all(
      tmpRuleList.map(async (rule: any) => {
        await Promise.all(
          rule.ruleMembers.map(async (member: any) => {
            if (
              member.userId !== null &&
              member.userId.toString() === userId &&
              member.day.includes(today)
            ) {
              todoRuleMembers.push(
                await checkTodoListForCheckStatus(rule, userId)
              );
            }
          })
        );
      })
    );

    // 2. 임시 담당자가 '나'인데 '오늘'인 경우, 규칙 목록을 체크 여부와 함께 전달
    await Promise.all(
      tmpRuleList.map(async (rule: any) => {
        await Promise.all(
          rule.tmpRuleMembers.map(async (member: any) => {
            // tmpUpdateDate가 오늘인데 userId가 있으면 나는 오늘 임시담당자
            const tmpUpdatedDate = dayjs(rule.tmpUpdatedDate).format(
              'YYYY-MM-DD'
            );
            if (
              member.userId !== null &&
              member.userId.toString() === userId &&
              tmpUpdatedDate === dayjs().format('YYYY-MM-DD')
            ) {
              todoRuleMembers.push(
                await checkTodoListForCheckStatus(rule, userId)
              );
            }
          })
        );
      })
    );

    // 규칙 리스트를 시간을 기준으로 오름차순 정렬
    const todoListWithDate: TodoWithDate[] = todoRuleMembers.sort(
      (before, current) => {
        return dayjs(before.createdAt).isAfter(dayjs(current.createdAt))
          ? 1
          : -1;
      }
    );

    // 규칙 리스트에서 시간 데이터 삭제
    const todoList: TodoResponseDto[] = todoListWithDate.map(
      ({ createdAt, ...rest }) => {
        return rest;
      }
    );

    const data: HomeResponseDto = {
      eventList: eventList,
      keyRulesList: keyRulesList,
      todoList: todoList.length === 0 ? [] : todoList,
      homieProfileList: homies,
      roomCode: room.roomCode
    };

    return data;
  } catch (error) {
    throw error;
  }
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
  getRoom,
  createRoom,
  getRoomAndUserByRoomCode,
  joinRoom,
  leaveRoom,
  getRoomInfoAtHome
};
