import dayjs from 'dayjs';
import mongoose from 'mongoose';
import errorGenerator from '../../errors/errorGenerator';
import {
  EventsResponseDto,
  HomeResponseDto,
  HomieProfileResponseDto,
  TodoResponseDto,
  TodoWithDate
} from '../../interfaces/room/response/HomeResponseDto';
import { RoomJoinResponseDto } from '../../interfaces/room/response/RoomJoinResponseDto';
import Event from '../../models/Event';
import Room from '../../models/Room';
import Rule from '../../models/Rule';
import User from '../../models/User';
import checkObjectIdValidation from '../../modules/checkObjectIdValidation';
import limitNum from '../../modules/limitNum';
import message from '../../modules/responseMessage';
import statusCode from '../../modules/statusCode';
import RoomServiceUtils from './RoomServiceUtils';

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

const getRoomAndUserByRoomCode = async (
  userId: string,
  roomCode: string
): Promise<RoomJoinResponseDto> => {
  try {
    let user = await RoomServiceUtils.findUserById(userId);

    user = await user.populate('typeId', 'typeColor');

    RoomServiceUtils.checkJoinedRoomId(user.roomId);

    const room = await Room.findOne({
      roomCode: roomCode
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

const getRoomInfoAtHome = async (
  userId: string,
  roomId: string
): Promise<HomeResponseDto> => {
  try {
    // ObjectId 형식인지 확인
    checkObjectIdValidation(roomId);

    // 존재하는 id인지 확인
    const user = await RoomServiceUtils.findUserById(userId);

    // 존재하는 room인지 확인
    const room = await RoomServiceUtils.findRoomById(roomId);

    // 참가하고 있는 방이 아니면 접근 불가능
    await RoomServiceUtils.checkForbiddenRoom(user.roomId, room._id);

    // KeyRules 조회
    const tmpKeyRulesList = await Rule.find({
      roomId: roomId,
      isKeyRules: true
    }).sort({ createdAt: 'asc' });

    let keyRulesList: string[] = await Promise.all(
      tmpKeyRulesList
        .slice(0, limitNum.KEY_RULES_AT_HOME_MAX_LENGTH)
        .map(async (keyRule: any) => {
          return keyRule.ruleName;
        })
    );

    // Events 조회
    const tmpEventList = await Event.find({
      roomId: roomId,
      date: { $gte: dayjs(dayjs().format('YYYY-MM-DD')) }
    });

    const eventList: EventsResponseDto[] = await Promise.all(
      tmpEventList.map(async (event: any) => {
        const nowEventDate = dayjs(event.date);
        const todayDate = dayjs().format('YYYY-MM-DD');
        const eventDday = nowEventDate.diff(dayjs(todayDate), 'day');
        const result = {
          _id: event._id,
          eventIcon: event.eventIcon,
          dDay: +eventDday
        };
        return result;
      })
    );

    eventList.sort((before, current) => {
      return before.dDay > current.dDay ? 1 : -1;
    });

    // Homie 조회
    const tmpHomies = await User.find({
      roomId: roomId
    })
      .populate('typeId', 'typeName typeColor')
      .sort({ typeUpdatedDate: 1 });

    const myProfile: HomieProfileResponseDto[] = [];
    const homieProfile: HomieProfileResponseDto[] = [];
    const homieProfileNoDate: HomieProfileResponseDto[] = [];
    await Promise.all(
      tmpHomies.map(async (homie: any) => {
        if (homie._id.toString() !== userId) {
          if (homie.typeUpdatedDate === null) {
            homieProfileNoDate.push({
              _id: homie._id,
              userName: homie.userName,
              typeName: homie.typeId.typeName,
              typeColor: homie.typeId.typeColor
            });
          } else {
            homieProfile.push({
              _id: homie._id,
              userName: homie.userName,
              typeName: homie.typeId.typeName,
              typeColor: homie.typeId.typeColor
            });
          }
        } else {
          myProfile.push({
            _id: homie._id,
            userName: homie.userName,
            typeName: homie.typeId.typeName,
            typeColor: homie.typeId.typeColor
          });
        }
      })
    );

    const allHomieProfile = myProfile
      .concat(homieProfile)
      .concat(homieProfileNoDate);

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
                await RoomServiceUtils.checkTodoListForCheckStatus(rule, userId)
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
          rule.tmpRuleMembers.map(async (memberId: any) => {
            // tmpUpdateDate가 오늘인데 userId가 있으면 나는 오늘 임시담당자
            const tmpUpdatedDate = dayjs(rule.tmpUpdatedDate).format(
              'YYYY-MM-DD'
            );
            if (
              memberId !== null &&
              memberId.toString() === userId &&
              tmpUpdatedDate === dayjs().format('YYYY-MM-DD')
            ) {
              todoRuleMembers.push(
                await RoomServiceUtils.checkTodoListForCheckStatus(rule, userId)
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
    let todoList: TodoResponseDto[] = todoListWithDate
      .slice(0, limitNum.RULES_AT_HOME_MAX_LENGTH)
      .map(({ createdAt, ...rest }) => {
        return rest;
      });

    const data: HomeResponseDto = {
      eventList: eventList,
      keyRulesList: keyRulesList,
      todoList: todoList.length === 0 ? [] : todoList,
      homieProfileList: allHomieProfile,
      roomCode: room.roomCode
    };

    return data;
  } catch (error) {
    throw error;
  }
};

export default {
  getRoom,
  getRoomAndUserByRoomCode,
  getRoomInfoAtHome
};
