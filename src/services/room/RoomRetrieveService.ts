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
    // ObjectId ???????????? ??????
    checkObjectIdValidation(roomId);

    // ???????????? id?????? ??????
    const user = await RoomServiceUtils.findUserById(userId);

    // ???????????? room?????? ??????
    const room = await RoomServiceUtils.findRoomById(roomId);

    // ???????????? ?????? ?????? ????????? ?????? ?????????
    await RoomServiceUtils.checkForbiddenRoom(user.roomId, room._id);

    // KeyRules ??????
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

    // Events ??????
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
          dDay: eventDday.toString()
        };
        return result;
      })
    );

    eventList.sort((before, current) => {
      return +before.dDay > +current.dDay ? 1 : -1;
    });

    // Homie ??????
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

    // to-do ?????? ?????? ?????? ??????
    const today = dayjs().day();
    const tmpRuleList = await Rule.find({
      roomId: roomId,
      isKeyRules: false
    });

    const todoRuleMembers: TodoWithDate[] = [];
    await Promise.all(
      tmpRuleList.map(async (rule: any) => {
        // 1. ?????? ???????????? '???'?????? '??????'??? ??????, ?????? ????????? ?????? ????????? ?????? ??????
        if (dayjs().isSame(rule.tmpUpdatedDate, 'day')) {
          await Promise.all(
            rule.tmpRuleMembers.map(async (memberId: any) => {
              // tmpUpdateDate??? ???????????? userId??? ????????? ?????? ?????? ???????????????
              const tmpUpdatedDate = dayjs(rule.tmpUpdatedDate).format(
                'YYYY-MM-DD'
              );
              if (
                memberId !== null &&
                memberId.toString() === userId &&
                tmpUpdatedDate === dayjs().format('YYYY-MM-DD')
              ) {
                todoRuleMembers.push(
                  await RoomServiceUtils.checkTodoListForCheckStatus(
                    rule,
                    userId
                  )
                );
              }
            })
          );
        } else {
          // 2. ?????????????????? '???'?????? '??????'??? ??????, ?????? ????????? ?????? ????????? ?????? ??????
          await Promise.all(
            rule.ruleMembers.map(async (member: any) => {
              if (
                member.userId !== null &&
                member.userId.toString() === userId &&
                member.day.includes(today)
              ) {
                todoRuleMembers.push(
                  await RoomServiceUtils.checkTodoListForCheckStatus(
                    rule,
                    userId
                  )
                );
              }
            })
          );
        }
      })
    );

    // ?????? ???????????? ????????? ???????????? ???????????? ??????
    const todoListWithDate: TodoWithDate[] = todoRuleMembers.sort(
      (before, current) => {
        return dayjs(before.createdAt).isAfter(dayjs(current.createdAt))
          ? 1
          : -1;
      }
    );

    // ?????? ??????????????? ?????? ????????? ??????
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
