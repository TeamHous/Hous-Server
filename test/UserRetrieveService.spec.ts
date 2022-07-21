import assert from 'assert';
import { afterEach } from 'mocha';
import { SignupDto } from '../src/interfaces/auth/request/SignupDto';
import { RoomJoinDto } from '../src/interfaces/room/request/RoomJoinDto';
import { RoomResponseDto } from '../src/interfaces/room/response/RoomResponseDto';
import { UserModifyResponseDto } from '../src/interfaces/user/response/UserModifyResponseDto';
import { UserProfileResponseDto } from '../src/interfaces/user/response/UserProfileResponseDto';
import Event from '../src/models/Event';
import Room from '../src/models/Room';
import Rule from '../src/models/Rule';
import RuleCategory from '../src/models/RuleCategory';
import User from '../src/models/User';
import RoomService from '../src/services/room/RoomService';
import UserRetrieveService from '../src/services/user/UserRetrieveService';
import UserService from '../src/services/user/UserService';

describe('UserRetrieveService Tests', () => {
  // 단위 테스트 종료될때마다 서비스 관련 컬렉션 초기화
  afterEach(async () => {
    await User.collection.drop();
  });
  it('getUserAtHome test', async () => {
    // given
    const given = await createUser('test@gmail.com');

    // when
    const result: UserProfileResponseDto =
      await UserRetrieveService.getUserAtHome(given.userId);

    // then
    assert.equal(result.userName, given.signupDto.userName);
    assert.equal(result.job, '');
    assert.equal(result.introduction, '');
    assert.equal(result.hashTag.length, 0);
    assert.equal(result.typeId, '62d286a0cc1d0ea0fc0c4b4f');
    assert.equal(result.typeName, '임시 디폴트');
    assert.equal(result.typeColor, 'GRAY');
    assert.equal(result.typeScore!.length, 0);
    assert.equal(result.notificationState, true);
  });

  it('getUserAtModify test', async () => {
    // given
    const given = await createUser('test@gmail.com');

    //when
    const result: UserModifyResponseDto =
      await UserRetrieveService.getUserAtModify(given.userId);

    //then
    assert.equal(result.userName, '테스트유저');
    assert.equal(result.job, '');
    assert.equal(result.introduction, '');
    assert.equal(result.hashTag.length, 0);
    assert.equal(result.typeName, '임시 디폴트');
    assert.equal(result.typeColor, 'GRAY');
  });

  it('getHomieProfile test', async () => {
    // given
    const givenRoomOwnerUser1 = await createUser('test1@gmail.com');
    const givenRoomJoinedUser2 = await createUser(
      'test2@gmail.com',
      '테스트유저2'
    );

    const createdRoom: RoomResponseDto = await RoomService.createRoom(
      givenRoomOwnerUser1.userId
    );
    const createdRoomId: string = createdRoom._id.toString();
    const createdRoomCode: string = createdRoom.roomCode;
    const roomJoinDto: RoomJoinDto = {
      roomCode: createdRoomCode
    };
    await RoomService.joinRoom(
      givenRoomJoinedUser2.userId,
      createdRoomId,
      roomJoinDto
    );

    // when
    const result = await UserRetrieveService.getHomieProfile(
      givenRoomOwnerUser1.userId,
      givenRoomJoinedUser2.userId
    );

    // then
    assert.equal(result.userName, '테스트유저2');
    assert.equal(result.job, '');
    assert.equal(result.introduction, '');
    assert.equal(result.hashTag!.length, 0);
    assert.equal(result.typeId, '62d286a0cc1d0ea0fc0c4b4f');
    assert.equal(result.typeName, '임시 디폴트');
    assert.equal(result.typeColor, 'GRAY');
    assert.equal(result.typeScore!.length, 0);

    await Room.collection.drop();
    await RuleCategory.collection.drop();
    await Event.collection.drop();
    await Rule.collection.drop();
  });
});

const createUser = async (email: string, userName?: string) => {
  const signupDto: SignupDto = {
    email: email,
    password: 'password',
    userName: !userName ? '테스트유저' : userName,
    gender: '남자',
    fcmToken: '테스트토큰'
  };
  const userId: string = (
    await UserService.createUser(signupDto)
  )._id.toString();

  return { userId, signupDto };
};
