import { EventCreateDto } from '../interfaces/event/EventCreateDto';
import { EventCreateResponseDto } from '../interfaces/event/EventCreateResponseDto';
import Event from '../models/Event';
import checkObjectIdValidation from '../modules/checkObjectIdValidation';
import checkValidUtils from '../modules/checkValidUtils';
import { IconType } from '../modules/IconType';
import limitNum from '../modules/limitNum';
import EventServiceUtil from './EventServiceUtil';

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
      eventCreateDto.participant.length,
      room.userCnt
    );

    // event 참여자 ObjectId 형식인지 확인
    let participants: string[] = [];
    eventCreateDto.participant.forEach(user => {
      checkObjectIdValidation(user);
      participants.push(user.toString());
    });

    // icon이 정해진 타입으로 왔는지 확인
    EventServiceUtil.isIconType(eventCreateDto.eventIcon as IconType);

    const event = new Event({
      roomId: roomId,
      eventName: eventCreateDto.eventName,
      eventIcon: eventCreateDto.eventIcon,
      date: eventCreateDto.date,
      participantsId: eventCreateDto.participant
    });

    await event.save();

    // 이벤트 생성 후 이벤트 개수 room에 반영
    await room.update({ eventCnt: room.eventCnt + 1 });

    const data: EventCreateResponseDto = {
      _id: event._id,
      eventName: event.eventName,
      eventIcon: event.eventIcon,
      date: event.date,
      participant: participants
    };

    return data;
  } catch (error) {
    throw error;
  }
};

export default {
  createEvent
};