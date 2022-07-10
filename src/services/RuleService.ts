import dayjs from 'dayjs';
import errorGenerator from '../errors/errorGenerator';
import { RuleCreateDto } from '../interfaces/rule/RuleCreateDto';
import { RuleResponseDto } from '../interfaces/rule/RuleResponseDto';
import { RuleCategoryCreateDto } from '../interfaces/rulecategory/RuleCategoryCreateDto';
import { RuleCategoryResponseDto } from '../interfaces/rulecategory/RuleCategoryResponseDto';
import { RuleCategoryUpdateDto } from '../interfaces/rulecategory/RuleCategoryUpdateDto';
import Rule from '../models/Rule';
import RuleCategory from '../models/RuleCategory';
import checkIconType from '../modules/checkIconType';
import checkObjectIdValidation from '../modules/checkObjectIdValidation';
import checkValidUtils from '../modules/checkValidUtils';
import limitNum from '../modules/limitNum';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import RuleServiceUtils from './RuleServiceUtils';

const createRule = async (
  userId: string,
  roomId: string,
  ruleCreateDto: RuleCreateDto
): Promise<RuleResponseDto> => {
  try {
    const user = await RuleServiceUtils.findUserById(userId);

    // roomId가 ObjectId 형식인지 확인
    checkObjectIdValidation(roomId);

    // categoryId가 ObjectId 형식인지 확인
    checkObjectIdValidation(ruleCreateDto.categoryId);

    // 방 존재 여부 확인
    const room = await RuleServiceUtils.findRoomById(roomId);

    // 규칙 개수 확인
    checkValidUtils.checkCountLimit(room.ruleCnt, limitNum.RULE_CNT);

    // isKeyRules == true 인 경우
    // 알림 비활성화, 담당자 설정 X, 요일 설정 X
    // 위 조건 충족 안 된 경우 -> 에러
    if (ruleCreateDto.isKeyRules == true) {
      if (
        ruleCreateDto.notificationState == true ||
        ruleCreateDto.ruleMembers.length != 0
      ) {
        throw errorGenerator({
          msg: message.BAD_REQUEST,
          statusCode: statusCode.BAD_REQUEST
        });
      }
    }

    ruleCreateDto.ruleMembers.forEach(ruleMember => {
      ruleMember.day.forEach(day => {
        // 선택된 요일이 전부 0~6 값이 아닌 경우 -> 에러
        checkValidUtils.checkDayNumber(day);
      });
      // 담당자가 체크됐는데 요일 선택 1개 이상 안 된 경우 -> 에러
      if (userId != null && ruleMember.day.length == 0) {
        throw errorGenerator({
          msg: message.BAD_REQUEST,
          statusCode: statusCode.BAD_REQUEST
        });
      }
      // 요일이 선택됐는데 isKeyRules == true 인 경우 -> 에러
      if (ruleMember.day.length != 0 && ruleCreateDto.isKeyRules == true) {
        throw errorGenerator({
          msg: message.BAD_REQUEST,
          statusCode: statusCode.BAD_REQUEST
        });
      }
    });

    // 담당자 X + 요일 선택 X -> isKeyRules == false -> 에러
    if (
      ruleCreateDto.ruleMembers.length == 0 &&
      ruleCreateDto.isKeyRules == false
    ) {
      throw errorGenerator({
        msg: message.BAD_REQUEST,
        statusCode: statusCode.BAD_REQUEST
      });
    }

    const rule = new Rule({
      roomId: roomId,
      categoryId: ruleCreateDto.categoryId,
      ruleName: ruleCreateDto.ruleName,
      ruleMembers: ruleCreateDto.ruleMembers,
      tmpRuleMembers: [],
      isKeyRules: ruleCreateDto.isKeyRules,
      notificationState: ruleCreateDto.notificationState,
      tmpUpdatedDate: dayjs().subtract(10, 'day')
    });

    await rule.save();

    await room.updateOne({ ruleCnt: room.ruleCnt + 1 });

    return rule;
  } catch (error) {
    throw error;
  }
};

const createRuleCategory = async (
  roomId: string,
  ruleCategoryCreateDto: RuleCategoryCreateDto
): Promise<RuleCategoryResponseDto> => {
  try {
    // roomId가 ObjectId 형식인지 확인
    checkObjectIdValidation(roomId);

    // 방 존재 여부 확인
    const room = await RuleServiceUtils.findRoomById(roomId);

    // 규칙 카테고리 개수 확인
    checkValidUtils.checkCountLimit(
      room.ruleCategoryCnt,
      limitNum.RULE_CATEGORY_CNT
    );

    // 규칙 카테고리명 중복 여부 확인
    await RuleServiceUtils.checkConflictRuleCategoryName(
      roomId,
      ruleCategoryCreateDto.categoryName
    );

    // 규칙 카테고리 아이콘 유효성 확인
    checkIconType.isRuleCategoryIconType(ruleCategoryCreateDto.categoryIcon);

    const ruleCategory = new RuleCategory({
      roomId: roomId,
      categoryName: ruleCategoryCreateDto.categoryName,
      categoryIcon: ruleCategoryCreateDto.categoryIcon
    });

    await ruleCategory.save();

    await room.update({ ruleCategoryCnt: room.ruleCategoryCnt + 1 });

    const data: RuleCategoryResponseDto = {
      _id: ruleCategory._id,
      roomId: roomId,
      ruleCategoryName: ruleCategory.categoryName,
      ruleCategoryIcon: ruleCategory.categoryIcon
    };

    return data;
  } catch (error) {
    throw error;
  }
};

const updateRuleCategory = async (
  roomId: string,
  categoryId: string,
  ruleCategoryUpdateDto: RuleCategoryUpdateDto
): Promise<RuleCategoryResponseDto | null> => {
  try {
    // roomId가 ObjectId 형식인지 확인
    checkObjectIdValidation(roomId);

    // categoryId가 ObjectId 형식인지 확인
    checkObjectIdValidation(categoryId);

    // 방 존재 여부 확인
    await RuleServiceUtils.findRoomById(roomId);

    // 규칙 카테고리 존재 여부 확인
    await RuleServiceUtils.findRuleCategoryById(categoryId);

    // 규칙 카테고리명 중복 여부 확인
    await RuleServiceUtils.checkConflictRuleCategoryName(
      roomId,
      ruleCategoryUpdateDto.categoryName
    );

    // 규칙 카테고리 아이콘 유효성 확인
    checkIconType.isRuleCategoryIconType(ruleCategoryUpdateDto.categoryIcon);

    await RuleCategory.findByIdAndUpdate(categoryId, ruleCategoryUpdateDto);

    const data: RuleCategoryResponseDto = {
      _id: categoryId,
      roomId: roomId,
      ruleCategoryName: ruleCategoryUpdateDto.categoryName,
      ruleCategoryIcon: ruleCategoryUpdateDto.categoryIcon
    };

    return data;
  } catch (error) {
    throw error;
  }
};

export default {
  createRule,
  createRuleCategory,
  updateRuleCategory
};
