import errorGenerator from '../errors/errorGenerator';
import Room from '../models/Room';
import Rule from '../models/Rule';
import RuleCategory from '../models/RuleCategory';
import User from '../models/User';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';

// 유저 존재 여부 확인
const findUserById = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw errorGenerator({
      msg: message.UNAUTHORIZED,
      statusCode: statusCode.UNAUTHORIZED
    });
  }
  return user;
};

// 방 존재 여부 확인
const findRoomById = async (roomId: string) => {
  const room = await Room.findById(roomId);
  if (!room) {
    throw errorGenerator({
      msg: message.NOT_FOUND_ROOM,
      statusCode: statusCode.NOT_FOUND
    });
  }
  return room;
};

// 규칙 존재 여부 확인
const findRuleById = async (ruleId: string) => {
  const rule = await Rule.findById(ruleId);
  if (!rule) {
    throw errorGenerator({
      msg: message.NOT_FOUND_RULE,
      statusCode: statusCode.NOT_FOUND
    });
  }
  return rule;
};

// 규칙 카테고리 존재 여부 확인
const findRuleCategoryById = async (categoryId: string) => {
  const ruleCategory = await RuleCategory.findById(categoryId);
  if (!ruleCategory) {
    throw errorGenerator({
      msg: message.NOT_FOUND_RULE_CATEGORY,
      statusCode: statusCode.NOT_FOUND
    });
  }
  return ruleCategory;
};

// 규칙 카테고리 중복 여부 확인
const checkConflictRuleCategoryName = async (
  roomId: string,
  categoryName: string
) => {
  const category = await RuleCategory.findOne({
    roomId: roomId,
    categoryName: categoryName
  });
  if (category) {
    throw errorGenerator({
      msg: message.CONFLICT_RULE_CATEGORY,
      statusCode: statusCode.CONFLICT
    });
  }
  return category;
};

export default {
  findUserById,
  findRoomById,
  findRuleById,
  findRuleCategoryById,
  checkConflictRuleCategoryName
};
