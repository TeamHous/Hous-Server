import errorGenerator from '../errors/errorGenerator';
import { PostBaseResponseDto } from '../interfaces/common/PostBaseResponseDto';
import { RuleCategoryCreateDto } from '../interfaces/rulecategory/RuleCategoryCreateDto';
import { RuleCategoryResponseDto } from '../interfaces/rulecategory/RuleCategoryResponseDto';
import Room from '../models/Room';
import RuleCategory from '../models/RuleCategory';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';

const createRuleCategory = async (
  roomId: string,
  ruleCategoryCreateDto: RuleCategoryCreateDto
): Promise<RuleCategoryResponseDto> => {
  try {
    // 방 존재 여부 확인
    const existRoom = await Room.findById(roomId);
    if (!existRoom)
      throw errorGenerator({
        msg: message.NOT_FOUND_ROOM,
        statusCode: statusCode.NOT_FOUND
      });

    // 규칙 카테고리명 중복 여부 확인
    const conflictCategory = await RuleCategory.findOne({
      roomId: roomId,
      categoryName: ruleCategoryCreateDto.categoryName
    });
    if (conflictCategory) {
      throw errorGenerator({
        msg: message.CONFLICT_RULE_CATEGORY,
        statusCode: statusCode.CONFLICT
      });
    }

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

export default {
  createRuleCategory
};
