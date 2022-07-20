import assert from 'assert';
import { afterEach } from 'mocha';
import { SignupDto } from '../src/interfaces/auth/request/SignupDto';
import { RoomJoinDto } from '../src/interfaces/room/request/RoomJoinDto';
import { RoomResponseDto } from '../src/interfaces/room/response/RoomResponseDto';
import { TypeTestDto } from '../src/interfaces/type/request/TypeTestDto';
import { UserModifyResponseDto } from '../src/interfaces/user/response/UserModifyResponseDto';
import { UserProfileResponseDto } from '../src/interfaces/user/response/UserProfileResponseDto';
import { UserSettingResponseDto } from '../src/interfaces/user/response/UserSettingResponseDto';
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

  it('getUserSetting test', async () => {
    // given
    const given = await createUser('test1@gmail.com');

    // when
    const result: UserSettingResponseDto =
      await UserRetrieveService.getUserSetting(given.userId);

    // then
    assert.equal(result.notificationState, true); // default notification
  });

  it('getMyTypeDetail test', async () => {
    // given
    const given = await createUser('test1@gmail.com');
    const userTypeTestDto: TypeTestDto = {
      typeScore: [8, 8, 5, 3, 9]
    };
    await UserService.updateUserTypeScore(given.userId, userTypeTestDto);

    // when
    const result = await UserRetrieveService.getTypeDetail(given.userId);

    // then
    assert.equal(result.userName, '테스트유저');
    assert.equal(result.typeName, '룸메 맞춤형 네각이');
    assert.equal(result.typeColor, 'BLUE');
    assert.equal(
      result.typeImg,
      'https://team-hous.s3.ap-northeast-2.amazonaws.com/Type/color/type_blue.png'
    );
    assert.equal(result.typeOneComment, '함께 고민해보자 :)');
    assert.equal(result.typeDesc.length !== 0, true);
    assert.equal(result.typeRulesTitle, '네각이와 함께 정하면 좋은 Rule!');
    assert.equal(result.typeRules.length, 2);
    assert.equal(result.good.typeName, '하이레벨 오각이');
    assert.equal(
      result.good.typeImg,
      'https://team-hous.s3.ap-northeast-2.amazonaws.com/Type/color/type_purple.png'
    );
    assert.equal(result.bad.typeName, '늘 행복한 동글이');
    assert.equal(
      result.bad.typeImg,
      'https://team-hous.s3.ap-northeast-2.amazonaws.com/Type/color/type_yellow.png'
    );
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
