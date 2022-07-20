import assert from 'assert';
import { afterEach } from 'mocha';
import { SignupDto } from '../src/interfaces/auth/request/SignupDto';
import { RoomResponseDto } from '../src/interfaces/room/response/RoomResponseDto';
import { RuleCreateDto } from '../src/interfaces/rule/request/RuleCreateDto';
import { RuleTodoCheckUpdateDto } from '../src/interfaces/rule/request/RuleTodoCheckUpdateDto';
import { RuleUpdateDto } from '../src/interfaces/rule/request/RuleUpdateDto';
import { TmpRuleMembersUpdateDto } from '../src/interfaces/rule/request/TmpRuleMembersUpdateDto';
import { RuleResponseDto } from '../src/interfaces/rule/response/RuleResponseDto';
import Event from '../src/models/Event';
import Room from '../src/models/Room';
import Rule from '../src/models/Rule';
import RuleCategory from '../src/models/RuleCategory';
import User from '../src/models/User';
import RoomService from '../src/services/room/RoomService';
import RuleService from '../src/services/rule/RuleService';
import UserService from '../src/services/user/UserService';

describe('RuleService Tests', () => {
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
    const given = await createUserAndRoom();
    const ruleCreateDto: RuleCreateDto = {
      notificationState: false,
      ruleName: '테스트 규칙',
      categoryId: given.createdCategory[0]._id.toString(),
      isKeyRules: true,
      ruleMembers: []
    };

    // when
    const rule: RuleResponseDto = await RuleService.createRule(
      given.userId,
      given.createdRoomId,
      ruleCreateDto
    );

    // then
    assert.equal(rule.roomId.toString(), given.createdRoomId);
    assert.equal(rule.ruleName, '테스트 규칙');
    assert.equal(rule.isKeyRules, true);
  });
  it('updateRule test', async () => {
    // given
    const given = await createUserAndRoom();
    const ruleCreateDto: RuleCreateDto = {
      notificationState: false,
      ruleName: '테스트 규칙',
      categoryId: given.createdCategory[0]._id.toString(),
      isKeyRules: true,
      ruleMembers: []
    };
    const createdRule: RuleResponseDto = await RuleService.createRule(
      given.userId,
      given.createdRoomId,
      ruleCreateDto
    );
    const ruleUpdateDto: RuleUpdateDto = {
      notificationState: false,
      ruleName: '테스트 규칙 수정',
      categoryId: given.createdCategory[0]._id.toString(),
      isKeyRules: true,
      ruleMembers: []
    };

    // when
    const updatedRule: RuleResponseDto = await RuleService.updateRule(
      given.userId,
      given.createdRoomId,
      createdRule._id.toString(),
      ruleUpdateDto
    );

    // then
    assert.equal(updatedRule.roomId.toString(), given.createdRoomId);
    assert.equal(updatedRule.ruleName, '테스트 규칙 수정');
    assert.equal(updatedRule.isKeyRules, true);
  });
  it('deleteRule test', async () => {
    // given
    const given = await createUserAndRoom();
    const ruleCreateDto: RuleCreateDto = {
      notificationState: false,
      ruleName: '테스트 규칙',
      categoryId: given.createdCategory[0]._id.toString(),
      isKeyRules: true,
      ruleMembers: []
    };
    const createdRule: RuleResponseDto = await RuleService.createRule(
      given.userId,
      given.createdRoomId,
      ruleCreateDto
    );

    // when
    await RuleService.deleteRule(
      given.userId,
      given.createdRoomId,
      createdRule._id.toString()
    );

    // then
    const deletedRule = await Rule.findById(createdRule._id);
    assert.equal(deletedRule, null);
  });

  it('updateMyRuleTodoCheck test', async () => {
    // given
    const given = await createUserAndRoom();
    const ruleCreateDto: RuleCreateDto = {
      notificationState: false,
      ruleName: '테스트 규칙',
      categoryId: given.createdCategory[0]._id.toString(),
      isKeyRules: true,
      ruleMembers: []
    };
    const createdRule: RuleResponseDto = await RuleService.createRule(
      given.userId,
      given.createdRoomId,
      ruleCreateDto
    );
    const createdRuleId = createdRule._id.toString();
    const tmpRuleMembersUpdateDto: TmpRuleMembersUpdateDto = {
      tmpRuleMembers: [given.userId]
    };
    await RuleService.updateTmpRuleMembers(
      given.userId,
      given.createdRoomId,
      createdRuleId,
      tmpRuleMembersUpdateDto
    );

    const ruleTodoCheckUpdateDto1: RuleTodoCheckUpdateDto = {
      isCheck: true
    };
    const ruleTodoCheckUpdateDto2: RuleTodoCheckUpdateDto = {
      isCheck: false
    };

    // when
    const result1 = await RuleService.updateMyRuleTodoCheck(
      given.userId,
      given.createdRoomId,
      createdRuleId,
      ruleTodoCheckUpdateDto1
    );
    const result2 = await RuleService.updateMyRuleTodoCheck(
      given.userId,
      given.createdRoomId,
      createdRuleId,
      ruleTodoCheckUpdateDto2
    );

    // then
    assert.equal(result1.isCheck, true);
    assert.equal(result2.isCheck, false);
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
  const createdCategory = await RuleCategory.find({ roomId: createdRoomId });

  return { userId, createdRoomId, createdCategory };
};
