import dayjs from 'dayjs';
import {
  EventResponseDto,
  UserType,
  UserTypeWithDate
} from '../../interfaces/event/response/EventResponseDto';
import User from '../../models/User';
import checkObjectIdValidation from '../../modules/checkObjectIdValidation';
import EventServiceUtils from './EventServiceUtils';

const getEvent = async (
  userId: string,
  roomId: string,
  eventId: string
): Promise<EventResponseDto> => {
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

    // 이벤트를 참여하는 모든 방의 유저 조회
    const usersInRoom = await User.find({ roomId: roomId }).populate(
      'typeId',
      'typeColor'
    );

    const participantsWithDate: UserTypeWithDate[] = [];
    const participantsNoDate: UserTypeWithDate[] = [];
    await Promise.all(
      usersInRoom.map(async (user: any) => {
        if (user.tmpUpdatedDate != null) {
          participantsWithDate.push({
            _id: user._id,
            userName: user.userName,
            typeColor: user.typeId.typeColor,
            typeUpdatedDate: user.typeUpdatedDate
          });
        } else {
          participantsNoDate.push({
            _id: user._id,
            userName: user.userName,
            typeColor: user.typeId.typeColor,
            typeUpdatedDate: user.typeUpdatedDate
          });
        }
      })
    );

    participantsWithDate.sort((before, current) => {
      return dayjs(before.typeUpdatedDate).isAfter(
        dayjs(current.typeUpdatedDate)
      )
        ? 1
        : -1;
    });

    const participantWithDate: UserTypeWithDate[] =
      participantsWithDate.concat(participantsNoDate);

    const participants: UserType[] = participantWithDate.map(
      ({ typeUpdatedDate, ...rest }) => {
        return rest;
      }
    );

    const data: EventResponseDto = {
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

export default {
  getEvent
};
