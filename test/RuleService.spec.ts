import assert from 'assert';
import { afterEach } from 'mocha';
import config from '../src/config';
import { SignupDto } from '../src/interfaces/auth/SignupDto';
import { RoomResponseDto } from '../src/interfaces/room/RoomResponseDto';
import { RuleCreateDto } from '../src/interfaces/rule/RuleCreateDto';
import { RuleResponseDto } from '../src/interfaces/rule/RuleResponseDto';
import connectDB from '../src/loaders/db';
import Check from '../src/models/Check';
import Event from '../src/models/Event';
import Room from '../src/models/Room';
import Rule from '../src/models/Rule';
import RuleCategory from '../src/models/RuleCategory';
import User from '../src/models/User';
import RoomService from '../src/services/RoomService';
import RuleService from '../src/services/RuleService';
import UserService from '../src/services/UserService';

describe('RuleService Tests', () => {
  if (config.env !== 'test') {
    throw Error('test 환경이 아닙니다.');
  }
  connectDB();
  // 단위 테스트 종료될때마다 서비스 관련 컬렉션 초기화
  afterEach(async () => {
    await User.collection.drop();
    await Room.collection.drop();
    await RuleCategory.collection.drop();
    await Event.collection.drop();
    await Rule.collection.drop();
    await Check.collection.drop();
  });
  it('createRule test', async () => {
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
    const createdCategory = await RuleCategory.find({ roomId: createdRoomId });
    const ruleCreateDto: RuleCreateDto = {
      notificationState: false,
      ruleName: '테스트 규칙',
      categoryId: createdCategory[0]._id.toString(),
      isKeyRules: true,
      ruleMembers: []
    };

    // when
    const rule: RuleResponseDto = await RuleService.createRule(
      userId,
      createdRoomId,
      ruleCreateDto
    );

    // then
    assert.equal(rule.roomId.toString(), createdRoomId);
    assert.equal(rule.ruleName, '테스트 규칙');
    assert.equal(rule.isKeyRules, true);
  });
});
