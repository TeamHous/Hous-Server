import dayjs from 'dayjs';
import { EventCreateDto } from '../../interfaces/event/request/EventCreateDto';
import { EventUpdateDto } from '../../interfaces/event/request/EventUpdateDto';
import { EventCreateResponseDto } from '../../interfaces/event/response/EventCreateResponseDto';
import { EventUpdateResponseDto } from '../../interfaces/event/response/EventUpdateResponseDto';
import Event from '../../models/Event';
import checkObjectIdValidation from '../../modules/checkObjectIdValidation';
import checkValidUtils from '../../modules/checkValidUtils';
import EventServiceUtils from './EventServiceUtils';

const createEvent = async (
  userId: string,
  roomId: string,
  eventCreateDto: EventCreateDto
): Promise<EventCreateResponseDto> => {
  try {
    // 유저 확인
    const user = await EventServiceUtils.findUserById(userId);

    // roomId ObjectId 형식인지 확인
    checkObjectIdValidation(roomId);

    // 방 존재 여부 확인
    const room = await EventServiceUtils.findRoomById(roomId);

    // 참가하고 있는 방이 아니면 접근 불가능
    await EventServiceUtils.checkForbiddenRoom(user.roomId, room._id);

    // event 개수 확인 // TODO 현재, 클라 이벤트 최대 10개 초과 다이얼로그가 없는 관계로 여러개 생성 가능하도록 변경 (앱잼)
    // checkValidUtils.checkCountLimit(room.eventCnt, limitNum.EVENT_CNT);

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
      date: dayjs(eventCreateDto.date).format('YYYY-MM-DD'),
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
    const user = await EventServiceUtils.findUserById(userId);

    // roomId ObjectId 형식인지 확인
    checkObjectIdValidation(roomId);

    // eventId ObjectId 형식인지 확인
    checkObjectIdValidation(eventId);

    // 방 존재 여부 확인
    const room = await EventServiceUtils.findRoomById(roomId);

    // 이벤트 존재 여부 확인
    const event = await EventServiceUtils.findEventById(eventId);

    // 참가하고 있는 방이 아니면 접근 불가능
    await EventServiceUtils.checkForbiddenRoom(user.roomId, room._id);

    // 참가하고 있는 방의 이벤트가 아니면 접근 불가능
    await EventServiceUtils.checkForbiddenEvent(user.roomId, event.roomId);

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

    await Event.findByIdAndUpdate(eventId, {
      eventName: eventUpdateDto.eventName,
      eventIcon: eventUpdateDto.eventIcon,
      date: dayjs(eventUpdateDto.date).format('YYYY-MM-DD'),
      participantsId: participants
    });

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
): Promise<void> => {
  try {
    // 유저 확인
    const user = await EventServiceUtils.findUserById(userId);

    // roomId ObjectId 형식인지 확인
    checkObjectIdValidation(roomId);

    // eventId ObjectId 형식인지 확인
    checkObjectIdValidation(eventId);

    // 방 존재 여부 확인
    const room = await EventServiceUtils.findRoomById(roomId);

    // 이벤트 존재 여부 확인
    const event = await EventServiceUtils.findEventById(eventId);

    // 참가하고 있는 방이 아니면 접근 불가능
    await EventServiceUtils.checkForbiddenRoom(user.roomId, room._id);

    // 참가하고 있는 방의 이벤트가 아니면 접근 불가능
    await EventServiceUtils.checkForbiddenEvent(user.roomId, event.roomId);

    await Event.findByIdAndDelete(eventId);

    await room.updateOne({ eventCnt: room.eventCnt - 1 });
  } catch (error) {
    throw error;
  }
};

export default {
  createEvent,
  updateEvent,
  deleteEvent
};
