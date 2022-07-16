import assert from 'assert';
import { afterEach } from 'mocha';
import config from '../src/config';
import { SignupDto } from '../src/interfaces/auth/request/SignupDto';
import { RoomResponseDto } from '../src/interfaces/room/response/RoomResponseDto';
import { RuleCreateDto } from '../src/interfaces/rule/request/RuleCreateDto';
import { RuleUpdateDto } from '../src/interfaces/rule/request/RuleUpdateDto';
import { RuleResponseDto } from '../src/interfaces/rule/response/RuleResponseDto';
import connectDB from '../src/loaders/db';
import Event from '../src/models/Event';
import Room from '../src/models/Room';
import Rule from '../src/models/Rule';
import RuleCategory from '../src/models/RuleCategory';
import User from '../src/models/User';
import RoomService from '../src/services/room/RoomService';
import RuleService from '../src/services/rule/RuleService';
import UserService from '../src/services/user/UserService';

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
  it('updateRule test', async () => {
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
    const createdRule: RuleResponseDto = await RuleService.createRule(
      userId,
      createdRoomId,
      ruleCreateDto
    );
    const ruleUpdateDto: RuleUpdateDto = {
      notificationState: false,
      ruleName: '테스트 규칙 수정',
      categoryId: createdCategory[0]._id.toString(),
      isKeyRules: true,
      ruleMembers: []
    };

    // when
    const updatedRule: RuleResponseDto = await RuleService.updateRule(
      userId,
      createdRoomId,
      createdRule._id.toString(),
      ruleUpdateDto
    );

    // then
    assert.equal(updatedRule.roomId.toString(), createdRoomId);
    assert.equal(updatedRule.ruleName, '테스트 규칙 수정');
    assert.equal(updatedRule.isKeyRules, true);
  });
  it('deleteRule test', async () => {
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
    const createdRule: RuleResponseDto = await RuleService.createRule(
      userId,
      createdRoomId,
      ruleCreateDto
    );

    // when
    await RuleService.deleteRule(
      userId,
      createdRoomId,
      createdRule._id.toString()
    );

    // then
    const deletedRule = await Rule.findById(createdRule._id);
    assert.equal(deletedRule, null);
  });
});
