import errorGenerator from '../errors/errorGenerator';
import { RuleCategoryCreateDto } from '../interfaces/rulecategory/RuleCategoryCreateDto';
import { RuleCategoryResponseDto } from '../interfaces/rulecategory/RuleCategoryResponseDto';
import { RuleCategoryUpdateDto } from '../interfaces/rulecategory/RuleCategoryUpdateDto';
import RuleCategory from '../models/RuleCategory';
import checkIconType from '../modules/checkIconType';
import checkObjectIdValidation from '../modules/checkObjectIdValidation';
import checkValidUtils from '../modules/checkValidUtils';
import limitNum from '../modules/limitNum';
import RuleServiceUtils from './RuleServiceUtils';

const createRuleCategory = async (
  userId: string,
  roomId: string,
  ruleCategoryCreateDto: RuleCategoryCreateDto
): Promise<RuleCategoryResponseDto> => {
  try {
    // 유저 존재 여부 확인
    await RuleServiceUtils.findUserById(userId);

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
  userId: string,
  roomId: string,
  categoryId: string,
  ruleCategoryUpdateDto: RuleCategoryUpdateDto
): Promise<RuleCategoryResponseDto | null> => {
  try {
    // 유저 존재 여부 확인
    await RuleServiceUtils.findUserById(userId);

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
  createRuleCategory,
  updateRuleCategory
};
