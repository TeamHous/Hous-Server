import assert from 'assert';
import { afterEach } from 'mocha';
import { SignupDto } from '../src/interfaces/auth/request/SignupDto';
import { RoomResponseDto } from '../src/interfaces/room/response/RoomResponseDto';
import { RuleCreateDto } from '../src/interfaces/rule/request/RuleCreateDto';
import { RuleCreateInfoResponseDto } from '../src/interfaces/rule/response/RuleCreateInfoResponseDto';
import { RuleMyTodoResponseDto } from '../src/interfaces/rule/response/RuleMyTodoResponseDto';
import { RuleReadInfoResponseDto } from '../src/interfaces/rule/response/RuleReadInfoResponseDto';
import { RuleResponseDto } from '../src/interfaces/rule/response/RuleResponseDto';
import { RulesByCategoryResponseDto } from '../src/interfaces/rule/response/RulesByCategoryResponseDto';
import { RuleCategoryCreateDto } from '../src/interfaces/rulecategory/request/RuleCategoryCreateDto';
import { RuleCategoryResponseDto } from '../src/interfaces/rulecategory/response/RuleCategoryResponseDto';
import Event from '../src/models/Event';
import Room from '../src/models/Room';
import Rule from '../src/models/Rule';
import RuleCategory from '../src/models/RuleCategory';
import User from '../src/models/User';
import RoomService from '../src/services/room/RoomService';
import RuleRetrieveService from '../src/services/rule/RuleRetrieveService';
import RuleService from '../src/services/rule/RuleService';
import UserService from '../src/services/user/UserService';

describe('RuleRetrieveService Tests', () => {
  // 단위 테스트 종료될때마다 서비스 관련 컬렉션 초기화
  afterEach(async () => {
    await User.collection.drop();
    await Room.collection.drop();
    await RuleCategory.collection.drop();
    await Event.collection.drop();
    await Rule.collection.drop();
  });
  it('getRuleByRuleId test', async () => {
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
    const createdCategory = await RuleCategory.find({ roomId: createdRoomId });
    const createRuleDto: RuleCreateDto = {
      notificationState: false,
      ruleName: '테스트규칙',
      categoryId: createdCategory[0]._id.toString(),
      isKeyRules: true,
      ruleMembers: []
    };
    const createdRule: RuleResponseDto = await RuleService.createRule(
      userId1,
      createdRoomId,
      createRuleDto
    );
    const createdRuleId: string = createdRule._id.toString();

    // when
    const response: RuleReadInfoResponseDto =
      await RuleRetrieveService.getRuleByRuleId(
        userId1,
        createdRoomId,
        createdRuleId
      );

    // then
    assert.equal(response.rule._id.toString(), createdRuleId);
    assert.equal(response.rule.notificationState, false);
    assert.equal(response.rule.ruleName, '테스트규칙');
    assert.equal(
      response.rule.ruleCategory._id.toString(),
      createdCategory[0]._id.toString()
    );
    assert.equal(response.rule.ruleMembers.length, 0);
  });
  it('getMyRuleInfo test', async () => {
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
    const createdCategory = await RuleCategory.find({ roomId: createdRoomId });
    const createRuleDto: RuleCreateDto = {
      notificationState: false,
      ruleName: '테스트규칙',
      categoryId: createdCategory[0]._id.toString(),
      isKeyRules: false,
      ruleMembers: [
        {
          userId: userId1,
          day: [0, 1, 2, 3, 4, 5, 6]
        }
      ]
    };
    const createdRule: RuleResponseDto = await RuleService.createRule(
      userId1,
      createdRoomId,
      createRuleDto
    );
    const createdRuleId: string = createdRule._id.toString();

    // when
    const response: RuleMyTodoResponseDto[] =
      await RuleRetrieveService.getMyRuleInfo(userId1, createdRoomId);

    // then
    assert.equal(response.length, 1);
    assert.equal(response[0]._id.toString(), createdRuleId);
    assert.equal(response[0].categoryIcon, createdCategory[0].categoryIcon);
    assert.equal(response[0].ruleName, '테스트규칙');
    assert.equal(response[0].isChecked, false);
  });
  it('getRulesByCategoryId', async () => {
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
      categoryName: '분리수거 테스트 카테고리',
      categoryIcon: 'TRASH'
    };
    const createRuledCategory: RuleCategoryResponseDto =
      await RuleService.createRuleCategory(
        userId1,
        createdRoomId,
        ruleCategoryCreateDto
      );
    const createdRuleCategoryId2: string = createRuledCategory._id.toString();
    const createRuleDto: RuleCreateDto = {
      notificationState: false,
      ruleName: '테스트규칙',
      categoryId: createdRuleCategoryId2,
      isKeyRules: true,
      ruleMembers: []
    };
    const createdRule: RuleResponseDto = await RuleService.createRule(
      userId1,
      createdRoomId,
      createRuleDto
    );

    // when
    const response: RulesByCategoryResponseDto =
      await RuleRetrieveService.getRulesByCategoryId(
        userId1,
        createdRoomId,
        createdRuleCategoryId2
      );

    // then
    const rulesByCategoryId = await Rule.find({
      isKeyRules: false,
      categoryId: createdRuleCategoryId2
    });
    const keyRulesByCategoryId = await Rule.find({
      isKeyRules: true,
      categoryId: createdRuleCategoryId2
    });
    rulesByCategoryId.forEach((rule: any) => {
      assert.equal(rule.categoryId, createdRuleCategoryId2);
    });
    keyRulesByCategoryId.forEach((keyRule: any) => {
      assert.equal(keyRule.categoryId, createdRuleCategoryId2);
    });
  });
  it('getRuleCreateInfo test', async () => {
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
    await RuleService.createRuleCategory(
      userId1,
      createdRoomId,
      ruleCategoryCreateDto
    );

    const ruleCreateInfo: RuleCreateInfoResponseDto =
      await RuleRetrieveService.getRuleCreateInfo(userId1, createdRoomId);

    // then
    const homieWithRoomId = await User.find({
      roomId: createdRoomId
    });
    homieWithRoomId.forEach((homie: any) => {
      assert.equal(homie.roomId, createdRoomId);
    });
    ruleCreateInfo.ruleCategories.forEach(async (category: any) => {
      const ruleCategory = await RuleCategory.find({
        _id: category._id
      });
      assert.equal(ruleCategory.length, 1);
      assert.equal(ruleCategory[0].roomId, createdRoomId);
    });
  });
});
