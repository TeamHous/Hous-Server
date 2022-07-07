import errorGenerator from '../errors/errorGenerator';
import { PostBaseResponseDto } from '../interfaces/common/PostBaseResponseDto';
import { RoomInfo } from '../interfaces/room/RoomInfo';
import { RuleCategoryCreateDto } from '../interfaces/rulecategory/RuleCategoryCreateDto';
import { RuleCategoryInfo } from '../interfaces/rulecategory/RuleCategoryInfo';
import Room from '../models/Room';
import RuleCategory from '../models/RuleCategory';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';

const createRuleCategory = async (
  roomId: string,
  ruleCategoryCreateDto: RuleCategoryCreateDto
): Promise<PostBaseResponseDto> => {
  try {
    // 방 존재 여부 확인
    const room: RoomInfo | null = await Room.findById(roomId);
    if (!room) {
      throw errorGenerator({
        msg: message.NOT_FOUND_ROOM,
        statusCode: statusCode.NOT_FOUND
      });
    }

    // 규칙 카테고리명 중복 여부 확인
    const conflictCategory: RuleCategoryInfo | null =
      await RuleCategory.findOne({
        categoryName: ruleCategoryCreateDto.categoryName
      });
    if (conflictCategory) {
      throw errorGenerator({
        msg: message.CONFLICT_RULE_CATEGORY,
        statusCode: statusCode.CONFLICT
      });
    }

    const ruleCategory = new RuleCategory({
      categoryName: ruleCategoryCreateDto.categoryName,
      categoryIcon: ruleCategoryCreateDto.categoryIcon
    });

    await ruleCategory.save();

    const data = {
      _id: ruleCategory._id
    };

    return data;
  } catch (error) {
    throw error;
  }
};

export default {
  createRuleCategory
};
