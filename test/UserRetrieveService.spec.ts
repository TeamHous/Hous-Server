import assert from 'assert';
import { afterEach } from 'mocha';
import { SignupDto } from '../src/interfaces/auth/request/SignupDto';
import { RoomJoinDto } from '../src/interfaces/room/request/RoomJoinDto';
import { RoomResponseDto } from '../src/interfaces/room/response/RoomResponseDto';
import { UserModifyResponseDto } from '../src/interfaces/user/response/UserModifyResponseDto';
import { UserProfileResponseDto } from '../src/interfaces/user/response/UserProfileResponseDto';
import User from '../src/models/User';
import RoomService from '../src/services/room/RoomService';
import UserRetrieveService from '../src/services/user/UserRetrieveService';
import UserService from '../src/services/user/UserService';

describe('UserRetrieveService Tests', () => {
  // 단위 테스트 종료될때마다 서비스 관련 컬렉션 초기화
  afterEach(async () => {
    await User.collection.drop();
  });
  it('getUserAtHome', async () => {
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

    // when
    const result: UserProfileResponseDto =
      await UserRetrieveService.getUserAtHome(userId);

    // then
    assert.equal(result.userName, signupDto.userName);
    assert.equal(result.job, '');
    assert.equal(result.introduction, '');
    assert.equal(result.hashTag.length, 0);
    assert.equal(result.typeId, '62d286a0cc1d0ea0fc0c4b4f');
    assert.equal(result.typeName, '임시 디폴트');
    assert.equal(result.typeColor, 'GRAY');
    assert.equal(result.typeScore!.length, 0);
    assert.equal(result.notificationState, true);
  });

  it('getUserAtModify', async () => {
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

    //when
    const result: UserModifyResponseDto =
      await UserRetrieveService.getUserAtModify(userId);

    //then
    assert.equal(result.userName, '테스트유저');
    assert.equal(result.job, '');
    assert.equal(result.introduction, '');
    assert.equal(result.hashTag.length, 0);
    assert.equal(result.typeName, '임시 디폴트');
    assert.equal(result.typeColor, 'GRAY');
  });

  it('getHomieProfile', async () => {
    // given
    const signupDto1: SignupDto = {
      email: 'test1@gmail.com',
      password: 'password',
      userName: '테스트유저1',
      gender: '남자',
      fcmToken: '테스트토큰'
    };
    const signupDto2: SignupDto = {
      email: 'test2@gmail.com',
      password: 'password',
      userName: '테스트유저2',
      gender: '남자',
      fcmToken: '테스트토큰'
    };

    const roomOwnerUserId: string = (
      await UserService.createUser(signupDto1)
    )._id.toString();

    const joinedUserId: string = (
      await UserService.createUser(signupDto2)
    )._id.toString();

    const createdRoom: RoomResponseDto = await RoomService.createRoom(
      roomOwnerUserId
    );
    const createdRoomId: string = createdRoom._id.toString();
    const createdRoomCode: string = createdRoom.roomCode;
    const roomJoinDto: RoomJoinDto = {
      roomCode: createdRoomCode
    };
    await RoomService.joinRoom(joinedUserId, createdRoomId, roomJoinDto);

    // when
    const result = await UserRetrieveService.getHomieProfile(
      roomOwnerUserId,
      joinedUserId
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
  });
});
