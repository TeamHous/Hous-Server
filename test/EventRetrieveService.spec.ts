import assert from 'assert';
import dayjs from 'dayjs';
import { SignupDto } from '../src/interfaces/auth/request/SignupDto';
import { EventResponseDto } from '../src/interfaces/event/response/EventResponseDto';
import { HomeResponseDto } from '../src/interfaces/room/response/HomeResponseDto';
import { RoomResponseDto } from '../src/interfaces/room/response/RoomResponseDto';
import Event from '../src/models/Event';
import Room from '../src/models/Room';
import RuleCategory from '../src/models/RuleCategory';
import User from '../src/models/User';
import EventRetrieveService from '../src/services/event/EventRetrieveService';
import RoomRetrieveService from '../src/services/room/RoomRetrieveService';
import RoomService from '../src/services/room/RoomService';
import UserService from '../src/services/user/UserService';

describe('EventRetrieveService Tests', () => {
  // 단위 테스트 종료될때마다 서비스 관련 컬렉션 초기화
  afterEach(async () => {
    await User.collection.drop();
    await Room.collection.drop();
    await RuleCategory.collection.drop();
    await Event.collection.drop();
  });
  it('getEvent test', async () => {
    // given
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

    // when
    const result: EventResponseDto = await EventRetrieveService.getEvent(
      userId,
      createdRoomId,
      resultInRoom.eventList[0]._id.toString()
    );

    // then
    assert.equal(result.eventName, '여기에 이벤트를 추가하세요.');
    assert.equal(result.eventIcon, 'PARTY');
    assert.equal(result.date, dayjs().add(10, 'day').format('YYYY-MM-DD'));
    assert.equal(result.participants.length, 1);
    assert.equal(result.participants[0]._id.toString(), userId);
    assert.equal(result.participants[0].isChecked, true);
    assert.equal(result.participants[0].typeColor, 'GRAY');
    assert.equal(result.participants[0].userName, '테스트유저');
  });
});
