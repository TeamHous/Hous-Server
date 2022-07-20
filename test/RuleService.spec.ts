import assert from 'assert';
import { afterEach } from 'mocha';
import { SignupDto } from '../src/interfaces/auth/request/SignupDto';
import { RoomResponseDto } from '../src/interfaces/room/response/RoomResponseDto';
import { RuleCreateDto } from '../src/interfaces/rule/request/RuleCreateDto';
import { RuleUpdateDto } from '../src/interfaces/rule/request/RuleUpdateDto';
import { RuleResponseDto } from '../src/interfaces/rule/response/RuleResponseDto';
import { RuleCategoryCreateDto } from '../src/interfaces/rulecategory/request/RuleCategoryCreateDto';
import { RuleCategoryUpdateDto } from '../src/interfaces/rulecategory/request/RuleCategoryUpdateDto';
import { RuleCategoryResponseDto } from '../src/interfaces/rulecategory/response/RuleCategoryResponseDto';
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
  it('createRuleCategory test', async () => {
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
    const ruleCategoryCreateDto: RuleCategoryCreateDto = {
      categoryName: '청소 테스트 카테고리',
      categoryIcon: 'CLEAN'
    };

    // when
    const ruleCategory: RuleCategoryResponseDto =
      await RuleService.createRuleCategory(
        userId1,
        createdRoomId,
        ruleCategoryCreateDto
      );

    // then
    assert.equal(ruleCategory.roomId.toString(), createdRoomId);
    assert.equal(ruleCategory.ruleCategoryName, '청소 테스트 카테고리');
    assert.equal(ruleCategory.ruleCategoryIcon, 'CLEAN');
    assert.equal(ruleCategory.ruleCnt, 0);
  });
  it('updateRuleCategory test', async () => {
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
    const ruleCategoryCreateDto: RuleCategoryCreateDto = {
      categoryName: '청소 테스트 카테고리',
      categoryIcon: 'CLEAN'
    };
    const createRuleCategory: RuleCategoryResponseDto =
      await RuleService.createRuleCategory(
        userId1,
        createdRoomId,
        ruleCategoryCreateDto
      );
    const createdRuleCategoryId: string = createRuleCategory._id.toString();
    const ruleCategoryUpdateDto: RuleCategoryUpdateDto = {
      categoryName: '분리수거 테스트 카테고리',
      categoryIcon: 'TRASH'
    };

    // when
    const updateRuleCategory: RuleCategoryResponseDto =
      await RuleService.updateRuleCategory(
        userId1,
        createdRoomId,
        createdRuleCategoryId,
        ruleCategoryUpdateDto
      );

    // then
    assert.equal(updateRuleCategory.roomId.toString(), createdRoomId);
    assert.equal(
      updateRuleCategory.ruleCategoryName,
      '분리수거 테스트 카테고리'
    );
    assert.equal(updateRuleCategory.ruleCategoryIcon, 'TRASH');
    assert.equal(updateRuleCategory.ruleCnt, 0);
  });
  it('deleteRuleCategory test', async () => {
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
    const ruleCategoryCreateDto: RuleCategoryCreateDto = {
      categoryName: '청소 테스트 카테고리',
      categoryIcon: 'CLEAN'
    };
    const createRuleCategory: RuleCategoryResponseDto =
      await RuleService.createRuleCategory(
        userId1,
        createdRoomId,
        ruleCategoryCreateDto
      );
    const createdRuleCategoryId: string = createRuleCategory._id.toString();
    const ruleCreateDto1: RuleCreateDto = {
      notificationState: false,
      ruleName: '테스트 규칙1',
      categoryId: createdRuleCategoryId,
      isKeyRules: true,
      ruleMembers: []
    };
    const ruleCreateDto2: RuleCreateDto = {
      notificationState: false,
      ruleName: '테스트 규칙2',
      categoryId: createdRuleCategoryId,
      isKeyRules: true,
      ruleMembers: []
    };
    await RuleService.createRule(userId1, createdRoomId, ruleCreateDto1);
    await RuleService.createRule(userId1, createdRoomId, ruleCreateDto2);

    // when
    await RuleService.deleteRuleCategory(
      userId1,
      createdRoomId,
      createdRuleCategoryId
    );

    // then
    const deletedRuleCategory = await RuleCategory.findById(
      createdRuleCategoryId
    );
    const deletedRules = await Rule.find({ categoryId: createdRuleCategoryId });
    assert.equal(deletedRuleCategory, null);
    assert.equal(deletedRules.length, 0);
  });
});
