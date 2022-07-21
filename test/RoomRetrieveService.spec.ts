import assert from 'assert';
import { afterEach } from 'mocha';
import mongoose from 'mongoose';
import { SignupDto } from '../src/interfaces/auth/request/SignupDto';
import { HomeResponseDto } from '../src/interfaces/room/response/HomeResponseDto';
import { RoomJoinResponseDto } from '../src/interfaces/room/response/RoomJoinResponseDto';
import { RoomResponseDto } from '../src/interfaces/room/response/RoomResponseDto';
import Event from '../src/models/Event';
import Room from '../src/models/Room';
import Rule from '../src/models/Rule';
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
    await Rule.collection.drop();
  });
  it('getRoom test', async () => {
    // given
    const given = await createUserAndRoom('test1@gmail.com');
    const createdRoom: RoomResponseDto = await RoomService.createRoom(
      given.userId
    );

    // when
    const response: mongoose.Types.ObjectId | null =
      await RoomRetrieveService.getRoom(given.userId.toString());

    // then
    assert.equal(response!.toString(), createdRoom._id);
  });
  it('getRoomAndUserByRoomCode test', async () => {
    // given
    const givenUser1 = await createUserAndRoom('test1@gmail.com');
    const createdRoom: RoomResponseDto = await RoomService.createRoom(
      givenUser1.userId
    );
    const givenUser2 = await createUserAndRoom('test2@gmail.com');

    // when
    const response: RoomJoinResponseDto =
      await RoomRetrieveService.getRoomAndUserByRoomCode(
        givenUser2.userId,
        createdRoom.roomCode
      );

    // then
    assert.equal(response._id.toString(), createdRoom._id.toString());
    assert.equal(response.typeColor, 'GRAY');
    assert.equal(response.userName, '테스트유저');
    assert.equal(response.introduction, '');
  });

  it('getRoomInfoAtHome test', async () => {
    // given
    const given = await createUserAndRoom('test@gmail.com');
    const createdRoom: RoomResponseDto = await RoomService.createRoom(
      given.userId
    );
    const createdRoomCode: string = createdRoom.roomCode;

    // when
    const resultInRoom: HomeResponseDto =
      await RoomRetrieveService.getRoomInfoAtHome(
        given.userId,
        createdRoom._id.toString()
      );

    // then
    assert.equal(resultInRoom.roomCode, createdRoomCode);
    assert.equal(resultInRoom.eventList.length, 1);
    assert.equal(resultInRoom.keyRulesList.length, 1);
    assert.equal(resultInRoom.todoList.length, 0);
    assert.equal(resultInRoom.homieProfileList.length, 1);
  });
});

const createUserAndRoom = async (email: string) => {
  const signupDto: SignupDto = {
    email: email,
    password: 'password',
    userName: '테스트유저',
    gender: '남자',
    fcmToken: '테스트토큰'
  };
  const userId: string = (
    await UserService.createUser(signupDto)
  )._id.toString();

  return { userId };
};
