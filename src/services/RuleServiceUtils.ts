import mongoose from 'mongoose';
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

const checkForbiddenRoom = async (
  userRoomId: mongoose.Types.ObjectId,
  roomId: mongoose.Types.ObjectId
) => {
  if (!userRoomId.equals(roomId)) {
    throw errorGenerator({
      msg: message.FORBIDDEN_ROOM,
      statusCode: statusCode.FORBIDDEN
    });
  }
};

const checkForbiddenRule = async (
  userRoomId: mongoose.Types.ObjectId,
  ruleRoomId: mongoose.Types.ObjectId
) => {
  if (!userRoomId.equals(ruleRoomId)) {
    throw errorGenerator({
      msg: message.FORBIDDEN_RULE,
      statusCode: statusCode.FORBIDDEN
    });
  }
};

const checkConflictRuleName = async (roomId: string, ruleName: string) => {
  const checkRules = await Rule.find({
    roomId: roomId,
    ruleName: ruleName
  });
  if (checkRules.length != 0) {
    throw errorGenerator({
      msg: message.CONFLICT_RULE_NAME,
      statusCode: statusCode.CONFLICT
    });
  }
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
  checkForbiddenRoom,
  checkForbiddenRule,
  checkConflictRuleName,
  checkConflictRuleCategoryName
};
