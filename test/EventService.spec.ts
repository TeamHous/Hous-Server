import assert from 'assert';
import { SignupDto } from '../src/interfaces/auth/request/SignupDto';
import { EventCreateDto } from '../src/interfaces/event/request/EventCreateDto';
import { EventUpdateDto } from '../src/interfaces/event/request/EventUpdateDto';
import { EventCreateResponseDto } from '../src/interfaces/event/response/EventCreateResponseDto';
import { EventUpdateResponseDto } from '../src/interfaces/event/response/EventUpdateResponseDto';
import { HomeResponseDto } from '../src/interfaces/room/response/HomeResponseDto';
import { RoomResponseDto } from '../src/interfaces/room/response/RoomResponseDto';
import Event from '../src/models/Event';
import Room from '../src/models/Room';
import Rule from '../src/models/Rule';
import RuleCategory from '../src/models/RuleCategory';
import User from '../src/models/User';
import EventService from '../src/services/event/EventService';
import RoomRetrieveService from '../src/services/room/RoomRetrieveService';
import RoomService from '../src/services/room/RoomService';
import UserService from '../src/services/user/UserService';

describe('EventService Tests', () => {
  // 단위 테스트 종료될때마다 서비스 관련 컬렉션 초기화
  afterEach(async () => {
    await User.collection.drop();
    await Room.collection.drop();
    await RuleCategory.collection.drop();
    await Event.collection.drop();
    await Rule.collection.drop();
  });

  it('createEvent test', async () => {
    // given
    const given = await createUserAndRoom();
    const eventCreateDto: EventCreateDto = {
      eventName: '이벤트 추가',
      eventIcon: 'CAKE',
      date: '2020-08-09',
      participants: [given.userId]
    };

    // when
    const result: EventCreateResponseDto = await EventService.createEvent(
      given.userId,
      given.createdRoomId,
      eventCreateDto
    );

    // then
    assert.equal(result.eventName, '이벤트 추가');
    assert.equal(result.eventIcon, 'CAKE');
    assert.equal(result.date, '2020-08-09');
    assert.equal(result.participants.length, 1);
    assert.equal(result.participants[0], given.userId);
  });

  it('updateEvent test', async () => {
    // given
    const given = await createUserAndRoom();
    const eventUpdateDto: EventUpdateDto = {
      eventName: '이벤트 수정',
      eventIcon: 'CAKE',
      date: '2020-08-09',
      participants: [given.userId]
    };

    // when
    const result: EventUpdateResponseDto = await EventService.updateEvent(
      given.userId,
      given.createdRoomId,
      given.resultInRoom.eventList[0]._id.toString(),
      eventUpdateDto
    );

    // then
    assert.equal(result.eventName, '이벤트 수정');
    assert.equal(result.eventIcon, 'CAKE');
    assert.equal(result.date, '2020-08-09');
    assert.equal(result.participants.length, 1);
    assert.equal(result.participants[0], given.userId);
  });

  it('deleteEvent test', async () => {
    // given
    const given = await createUserAndRoom();

    // when
    const result = await EventService.deleteEvent(
      given.userId,
      given.createdRoomId,
      given.resultInRoom.eventList[0]._id.toString()
    );

    // then
    assert.equal(result, null);
  });
});

const createUserAndRoom = async () => {
  const signupDto: SignupDto = {
    email: 'test@gmail.com',
    password: 'password',
    userName: '테스트유저',
    gender: '남자',
    fcmToken: '테스트토큰'
  };
  const userId: string = (
    await UserService.createUser(signupDto)
  )._id.toString();
  const createdRoom: RoomResponseDto = await RoomService.createRoom(userId);
  const createdRoomId: string = createdRoom._id.toString();
  const resultInRoom: HomeResponseDto =
    await RoomRetrieveService.getRoomInfoAtHome(userId, createdRoomId);

  return { userId, createdRoomId, resultInRoom };
};
