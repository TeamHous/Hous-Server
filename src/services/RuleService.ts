import errorGenerator from '../errors/errorGenerator';
import { RuleCategoryCreateDto } from '../interfaces/rulecategory/RuleCategoryCreateDto';
import { RuleCategoryResponseDto } from '../interfaces/rulecategory/RuleCategoryResponseDto';
import { RuleCategoryUpdateDto } from '../interfaces/rulecategory/RuleCategoryUpdateDto';
import RuleCategory from '../models/RuleCategory';
import checkObjectIdValidation from '../modules/checkObjectIdValidation';
import RuleServiceUtils from './RuleServiceUtils';

const createRuleCategory = async (
  roomId: string,
  ruleCategoryCreateDto: RuleCategoryCreateDto
): Promise<RuleCategoryResponseDto> => {
  try {
    // roomId가 ObjectId 형식인지 확인
    checkObjectIdValidation(roomId);

    // 방 존재 여부 확인
    await RuleServiceUtils.findRoomById(roomId);

    // 규칙 카테고리명 중복 여부 확인
    await RuleServiceUtils.checkConflictRuleCategoryName(
      roomId,
      ruleCategoryCreateDto.categoryName
    );

    const ruleCategory = new RuleCategory({
      roomId: roomId,
      categoryName: ruleCategoryCreateDto.categoryName,
      categoryIcon: ruleCategoryCreateDto.categoryIcon
    });

    await ruleCategory.save();

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
