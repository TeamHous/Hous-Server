import assert from 'assert';
import { afterEach } from 'mocha';
import { SignupDto } from '../src/interfaces/auth/request/SignupDto';
import { PostBaseResponseDto } from '../src/interfaces/common/response/PostBaseResponseDto';
import { RoomJoinDto } from '../src/interfaces/room/request/RoomJoinDto';
import { RoomResponseDto } from '../src/interfaces/room/response/RoomResponseDto';
import Event from '../src/models/Event';
import Room from '../src/models/Room';
import Rule from '../src/models/Rule';
import RuleCategory from '../src/models/RuleCategory';
import User from '../src/models/User';
import RoomService from '../src/services/room/RoomService';
import UserService from '../src/services/user/UserService';

describe('RoomService Tests', () => {
  // 단위 테스트 종료될때마다 서비스 관련 컬렉션 초기화
  afterEach(async () => {
    await User.collection.drop();
    await Room.collection.drop();
    await RuleCategory.collection.drop();
    await Event.collection.drop();
    await Rule.collection.drop();
  });
  it('createRoom test', async () => {
    // given
    const given = await createUserAndRoom('test@gmail.com');

    // when
    const result: RoomResponseDto = await RoomService.createRoom(given.userId);
    const createdRoomId: string = result._id.toString();

    // then
    const user = await User.findById(given.userId);
    assert.equal(user!.roomId.toString(), createdRoomId);
  });
  it('joinRoom test', async () => {
    // given
    const givenUser1 = await createUserAndRoom('test1@gmail.com');
    const givenUser2 = await createUserAndRoom('test2@gmail.com');
    const createdRoom: RoomResponseDto = await RoomService.createRoom(
      givenUser1.userId
    );
    const createdRoomId: string = createdRoom._id.toString();
    const createdRoomCode: string = createdRoom.roomCode;
    const roomJoinDto: RoomJoinDto = {
      roomCode: createdRoomCode
    };

    // when
    const result: PostBaseResponseDto = await RoomService.joinRoom(
      givenUser2.userId,
      createdRoomId,
      roomJoinDto
    );

    // then
    const user = await User.findById(givenUser2.userId);
    assert.equal(user!.roomId.toString(), createdRoomId);
    assert.equal(user!.roomId.toString(), result._id.toString());
  });
  it('leaveRoom test', async () => {
    // given
    const given = await createUserAndRoom('test1@gmail.com');
    const createdRoom: RoomResponseDto = await RoomService.createRoom(
      given.userId
    );
    const createdRoomId: string = createdRoom._id.toString();

    // when
    await RoomService.leaveRoom(given.userId, createdRoomId);

    // then
    const user = await User.findById(given.userId);
    assert.equal(user!.roomId, null);
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
