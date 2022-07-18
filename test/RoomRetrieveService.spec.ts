import assert from 'assert';
import { afterEach } from 'mocha';
import mongoose from 'mongoose';
import { SignupDto } from '../src/interfaces/auth/request/SignupDto';
import { RoomResponseDto } from '../src/interfaces/room/response/RoomResponseDto';
import Event from '../src/models/Event';
import Room from '../src/models/Room';
import RuleCategory from '../src/models/RuleCategory';
import User from '../src/models/User';
import RoomRetrieveService from '../src/services/room/RoomRetrieveService';
import RoomService from '../src/services/room/RoomService';
import UserService from '../src/services/user/UserService';

describe('RoomRetrieveService Tests', () => {
  // 단위 테스트 종료될때마다 서비스 관련 컬렉션 초기화
  afterEach(async () => {
    await User.collection.drop();
    await Room.collection.drop();
    await RuleCategory.collection.drop();
    await Event.collection.drop();
  });
  it('getRoom test', async () => {
    // given
    const signupDto1: SignupDto = {
      email: 'test1@gmail.com',
      password: 'password',
      userName: '테스트유저',
      gender: '남자',
      fcmToken: '테스트토큰'
    };
    const userId1: string = (
      await UserService.createUser(signupDto1)
    )._id.toString();
    const createdRoom: RoomResponseDto = await RoomService.createRoom(userId1);
    const createdRoomId: string = createdRoom._id.toString();

    // when
    const response: mongoose.Types.ObjectId | null =
      await RoomRetrieveService.getRoom(userId1);

    // then
    assert.equal(response!.toString(), createdRoomId);
  });
});
