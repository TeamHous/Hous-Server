import dayjs from 'dayjs';
import { PostBaseResponseDto } from '../interfaces/common/PostBaseResponseDto';
import { EventCreateDto } from '../interfaces/event/EventCreateDto';
import { EventCreateResponseDto } from '../interfaces/event/EventCreateResponseDto';
import { EventUpdateDto } from '../interfaces/event/EventUpdateDto';
import { EventUpdateResponseDto } from '../interfaces/event/EventUpdateResponseDto';
import Event from '../models/Event';
import checkObjectIdValidation from '../modules/checkObjectIdValidation';
import checkValidUtils from '../modules/checkValidUtils';
import limitNum from '../modules/limitNum';
import EventServiceUtil from './EventServiceUtils';

const createEvent = async (
  userId: string,
  roomId: string,
  eventCreateDto: EventCreateDto
): Promise<EventCreateResponseDto> => {
  try {
    // 유저 확인
    await EventServiceUtil.findUserById(userId);

    // roomId ObjectId 형식인지 확인
    checkObjectIdValidation(roomId);

    // 방 존재 여부 확인
    const room = await EventServiceUtil.findRoomById(roomId);

    // event 개수 확인
    checkValidUtils.checkCountLimit(room.eventCnt, limitNum.EVENT_CNT);

    // 참여자 개수가 방 인원의 수가 넘는지 확인
    checkValidUtils.checkArraySize(
      eventCreateDto.participants.length,
      room.userCnt
    );

    // event 참여자 ObjectId 형식인지 확인
    const participants: string[] = eventCreateDto.participants.map(user => {
      checkObjectIdValidation(user);
      return user;
    });

    const event = new Event({
      roomId: roomId,
      eventName: eventCreateDto.eventName,
      eventIcon: eventCreateDto.eventIcon,
      date: dayjs(eventCreateDto.date),
      participantsId: eventCreateDto.participants
    });

    await event.save();

    // 이벤트 생성 후 이벤트 개수 room에 반영
    await room.updateOne({ eventCnt: room.eventCnt + 1 });

    const data: EventCreateResponseDto = {
      _id: event._id,
      eventName: event.eventName,
      eventIcon: event.eventIcon,
      date: dayjs(event.date).format('YYYY-MM-DD'),
      participants: participants
    };

    return data;
  } catch (error) {
    throw error;
  }
};

const updateEvent = async (
  userId: string,
  roomId: string,
  eventId: string,
  eventUpdateDto: EventUpdateDto
): Promise<EventUpdateResponseDto> => {
  try {
    // 유저 확인
    await EventServiceUtil.findUserById(userId);

    // roomId ObjectId 형식인지 확인
    checkObjectIdValidation(roomId);

    // eventId ObjectId 형식인지 확인
    checkObjectIdValidation(eventId);

    // 방 존재 여부 확인
    const room = await EventServiceUtil.findRoomById(roomId);

    // 이벤트 존재 여부 확인
    const event = await EventServiceUtil.findEventById(eventId);

    // 참여자 개수가 방 인원의 수가 넘는지 확인
    checkValidUtils.checkArraySize(
      eventUpdateDto.participants.length,
      room.userCnt
    );

    // event 참여자 ObjectId 형식인지 확인
    let participants: string[] = [];
    eventUpdateDto.participants.forEach(user => {
      checkObjectIdValidation(user);
      participants.push(user.toString());
    });

    await Event.findByIdAndUpdate(eventId, eventUpdateDto);

    const data: EventUpdateResponseDto = {
      _id: event._id,
      eventName: eventUpdateDto.eventName,
      eventIcon: eventUpdateDto.eventIcon,
      date: dayjs(eventUpdateDto.date).format('YYYY-MM-DD'),
      participants: participants
    };
    return data;
  } catch (error) {
    throw error;
  }
};

const deleteEvent = async (
  userId: string,
  roomId: string,
  eventId: string
): Promise<PostBaseResponseDto> => {
  try {
    // 유저 확인
    await EventServiceUtil.findUserById(userId);

    // roomId ObjectId 형식인지 확인
    checkObjectIdValidation(roomId);

    // eventId ObjectId 형식인지 확인
    checkObjectIdValidation(eventId);

    // 방 존재 여부 확인
    const room = await EventServiceUtil.findRoomById(roomId);

    // 이벤트 존재 여부 확인
    const event = await EventServiceUtil.findEventById(eventId);

    await Event.findByIdAndDelete(eventId);

    await room.updateOne({ eventCnt: room.eventCnt - 1 });

    const data: PostBaseResponseDto = {
      _id: event._id
    };
    return data;
  } catch (error) {
    throw error;
  }
};

export default {
  createEvent,
  updateEvent,
  deleteEvent
};
