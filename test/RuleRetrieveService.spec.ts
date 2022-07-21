import assert from 'assert';
import { afterEach } from 'mocha';
import { SignupDto } from '../src/interfaces/auth/request/SignupDto';
import { RoomResponseDto } from '../src/interfaces/room/response/RoomResponseDto';
import { RuleCreateDto } from '../src/interfaces/rule/request/RuleCreateDto';
import { RuleMyTodoResponseDto } from '../src/interfaces/rule/response/RuleMyTodoResponseDto';
import { RuleReadInfoResponseDto } from '../src/interfaces/rule/response/RuleReadInfoResponseDto';
import { RuleResponseDto } from '../src/interfaces/rule/response/RuleResponseDto';
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
    const given = await createUserAndRoom();
    const createRuleDto: RuleCreateDto = {
      notificationState: false,
      ruleName: '테스트규칙',
      categoryId: given.createdCategory[0]._id.toString(),
      isKeyRules: true,
      ruleMembers: []
    };
    const createdRule: RuleResponseDto = await RuleService.createRule(
      given.userId,
      given.createdRoomId,
      createRuleDto
    );
    const createdRuleId: string = createdRule._id.toString();

    // when
    const response: RuleReadInfoResponseDto =
      await RuleRetrieveService.getRuleByRuleId(
        given.userId,
        given.createdRoomId,
        createdRuleId
      );

    // then
    assert.equal(response.rule._id.toString(), createdRuleId);
    assert.equal(response.rule.notificationState, false);
    assert.equal(response.rule.ruleName, '테스트규칙');
    assert.equal(
      response.rule.ruleCategory._id.toString(),
      given.createdCategory[0]._id.toString()
    );
    assert.equal(response.rule.ruleMembers.length, 0);
  });

  it('getMyRuleInfo test', async () => {
    // given
    const given = await createUserAndRoom();
    const createRuleDto: RuleCreateDto = {
      notificationState: false,
      ruleName: '테스트규칙',
      categoryId: given.createdCategory[0]._id.toString(),
      isKeyRules: false,
      ruleMembers: [
        {
          userId: given.userId,
          day: [0, 1, 2, 3, 4, 5, 6]
        }
      ]
    };
    const createdRule: RuleResponseDto = await RuleService.createRule(
      given.userId,
      given.createdRoomId,
      createRuleDto
    );
    const createdRuleId: string = createdRule._id.toString();

    // when
    const response: RuleMyTodoResponseDto[] =
      await RuleRetrieveService.getMyRuleInfo(
        given.userId,
        given.createdRoomId
      );

    // then
    assert.equal(response.length, 1);
    assert.equal(response[0]._id.toString(), createdRuleId);
    assert.equal(
      response[0].categoryIcon,
      given.createdCategory[0].categoryIcon
    );
    assert.equal(response[0].ruleName, '테스트규칙');
    assert.equal(response[0].isChecked, false);
  });

  it('getRuleInfoAtRuleHome test', async () => {
    // given
    const given = await createUserAndRoom();

    // when
    const result = await RuleRetrieveService.getRuleInfoAtRuleHome(
      given.userId,
      given.createdRoomId
    );

    // then
    assert.equal(result.homeRuleCategories.length, 1);
    assert.equal(result.todayTodoRules.length, 1);
    assert.equal(result.homeRuleCategories[0].categoryName, '청소');
    assert.equal(result.homeRuleCategories[0].categoryIcon, 'CLEAN');
    assert.equal(result.todayTodoRules[0].ruleName, '화장실 청소');
    assert.equal(result.todayTodoRules[0].todayMembersWithTypeColor.length, 0);
    assert.equal(result.todayTodoRules[0].isTmpMember, false);
    assert.equal(result.todayTodoRules[0].isAllChecked, false);
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
