import dayjs from 'dayjs';
import errorGenerator from '../errors/errorGenerator';
import { RuleCreateDto } from '../interfaces/rule/RuleCreateDto';
import {
  Homies,
  RuleCategories,
  RuleCreateInfoResponseDto
} from '../interfaces/rule/RuleCreateInfoResponseDto';
import {
  RuleMembers,
  RuleReadInfo,
  RuleReadInfoResponseDto
} from '../interfaces/rule/RuleReadInfoResponseDto';
import { RuleResponseDto } from '../interfaces/rule/RuleResponseDto';
import { RuleUpdateDto } from '../interfaces/rule/RuleUpdateDto';
import { RuleCategoryCreateDto } from '../interfaces/rulecategory/RuleCategoryCreateDto';
import { RuleCategoryResponseDto } from '../interfaces/rulecategory/RuleCategoryResponseDto';
import { RuleCategoryUpdateDto } from '../interfaces/rulecategory/RuleCategoryUpdateDto';
import Check from '../models/Check';
import Rule from '../models/Rule';
import RuleCategory from '../models/RuleCategory';
import User from '../models/User';
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

    // 참가하고 있는 방이 아니면 접근 불가능
    await RuleServiceUtils.checkForbiddenRoom(user.roomId, room._id);

    // 규칙 개수 확인
    checkValidUtils.checkCountLimit(room.ruleCnt, limitNum.RULE_CNT);

    // 규칙 이름 중복 체크
    await RuleServiceUtils.checkConflictRuleName(
      room._id,
      ruleCreateDto.ruleName
    );

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

const getRuleByRuleId = async (
  userId: string,
  roomId: string,
  ruleId: string
): Promise<RuleReadInfoResponseDto> => {
  try {
    const user = await RuleServiceUtils.findUserById(userId);

    // roomId가 ObjectId 형식인지 확인
    checkObjectIdValidation(roomId);

    // ruleId가 ObjectId 형식인지 확인
    checkObjectIdValidation(ruleId);

    // 방 존재 여부 확인
    const room = await RuleServiceUtils.findRoomById(roomId);

    // 규칙 존재 여부 확인
    const rule = await RuleServiceUtils.findRuleById(ruleId);

    // 참가하고 있는 방이 아니면 접근 불가능
    await RuleServiceUtils.checkForbiddenRoom(user.roomId, room._id);

    // 참가하고 있는 방의 규칙이 아니면 접근 불가능
    await RuleServiceUtils.checkForbiddenRule(user.roomId, rule.roomId);

    const tmpRuleCategories = await RuleCategory.find({
      roomId: user.roomId
    });

    const ruleCategories: RuleCategories[] = await Promise.all(
      tmpRuleCategories.map(async (ruleCategory: any) => {
        const result = {
          _id: ruleCategory._id,
          categoryName: ruleCategory.categoryName
        };

        return result;
      })
    );

    const tmpHomies = await User.find({
      roomId: user.roomId
    }).populate('typeId', 'typeColor');

    const homies: Homies[] = await Promise.all(
      tmpHomies.map(async (homie: any) => {
        const result = {
          _id: homie._id,
          name: homie.userName,
          typeColor: homie.typeId.typeColor
        };

        return result;
      })
    );

    await rule.populate('categoryId', 'categoryName');
    await rule.populate('ruleMembers.userId', 'typeId userName');
    await rule.populate('ruleMembers.userId.typeId', 'typeColor');

    const ruleMembers: RuleMembers[] = await Promise.all(
      rule.ruleMembers.map(async (ruleMember: any) => {
        const result = {
          homie: {
            _id: ruleMember.userId._id,
            name: (ruleMember.userId as any).userName,
            typeColor: (ruleMember.userId as any).typeId.typeColor
          },
          day: ruleMember.day
        };

        return result;
      })
    );

    const ruleReadInfo: RuleReadInfo = {
      _id: rule._id,
      notificationState: rule.notificationState,
      ruleName: rule.ruleName,
      ruleCategory: {
        _id: rule.categoryId._id,
        categoryName: (rule.categoryId as any).categoryName
      },
      isKeyRules: rule.isKeyRules,
      ruleMembers: ruleMembers
    };

    const data: RuleReadInfoResponseDto = {
      rule: ruleReadInfo,
      ruleCategories: ruleCategories,
      homies: homies
    };

    return data;
  } catch (error) {
    throw error;
  }
};

const updateRule = async (
  userId: string,
  roomId: string,
  ruleId: string,
  ruleUpdateDto: RuleUpdateDto
): Promise<RuleResponseDto> => {
  try {
    const user = await RuleServiceUtils.findUserById(userId);

    // roomId가 ObjectId 형식인지 확인
    checkObjectIdValidation(roomId);

    // ruleId가 ObjectId 형식인지 확인
    checkObjectIdValidation(ruleId);

    // categoryId가 ObjectId 형식인지 확인
    checkObjectIdValidation(ruleUpdateDto.categoryId);

    // 방 존재 여부 확인
    const room = await RuleServiceUtils.findRoomById(roomId);

    // 참가하고 있는 방이 아니면 접근 불가능
    await RuleServiceUtils.checkForbiddenRoom(user.roomId, room._id);

    // 규칙 존재 여부 확인
    let rule = await RuleServiceUtils.findRuleById(ruleId);

    // 참가하고 있는 방의 규칙이 아니면 접근 불가능
    await RuleServiceUtils.checkForbiddenRule(user.roomId, rule.roomId);

    // 규칙 이름 중복 체크
    if (rule.ruleName != ruleUpdateDto.ruleName) {
      await RuleServiceUtils.checkConflictRuleName(
        room._id,
        ruleUpdateDto.ruleName
      );
    }

    // isKeyRules == true 인 경우
    // 알림 비활성화, 담당자 설정 X, 요일 설정 X
    // 위 조건 충족 안 된 경우 -> 에러
    if (ruleUpdateDto.isKeyRules == true) {
      if (
        ruleUpdateDto.notificationState == true ||
        ruleUpdateDto.ruleMembers.length != 0
      ) {
        throw errorGenerator({
          msg: message.BAD_REQUEST,
          statusCode: statusCode.BAD_REQUEST
        });
      }
    }

    ruleUpdateDto.ruleMembers.forEach(ruleMember => {
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
      if (ruleMember.day.length != 0 && ruleUpdateDto.isKeyRules == true) {
        throw errorGenerator({
          msg: message.BAD_REQUEST,
          statusCode: statusCode.BAD_REQUEST
        });
      }
    });

    // 담당자 X + 요일 선택 X -> isKeyRules == false -> 에러
    if (
      ruleUpdateDto.ruleMembers.length == 0 &&
      ruleUpdateDto.isKeyRules == false
    ) {
      throw errorGenerator({
        msg: message.BAD_REQUEST,
        statusCode: statusCode.BAD_REQUEST
      });
    }

    await rule.updateOne(ruleUpdateDto);

    rule = await RuleServiceUtils.findRuleById(ruleId);

    return rule;
  } catch (error) {
    throw error;
  }
};

const deleteRule = async (
  userId: string,
  roomId: string,
  ruleId: string
): Promise<void> => {
  try {
    const user = await RuleServiceUtils.findUserById(userId);

    // roomId가 ObjectId 형식인지 확인
    checkObjectIdValidation(roomId);

    // ruleId가 ObjectId 형식인지 확인
    checkObjectIdValidation(ruleId);

    // 방 존재 여부 확인
    const room = await RuleServiceUtils.findRoomById(roomId);

    // 참가하고 있는 방이 아니면 접근 불가능
    await RuleServiceUtils.checkForbiddenRoom(user.roomId, room._id);

    // 규칙 존재 여부 확인
    const rule = await RuleServiceUtils.findRuleById(ruleId);

    // 참가하고 있는 방의 규칙이 아니면 접근 불가능
    await RuleServiceUtils.checkForbiddenRule(user.roomId, rule.roomId);

    // 규칙과 관련된 check 삭제
    const checks = await Check.find({ ruleId: rule._id });
    for (const check of checks) {
      await check.deleteOne();
    }

    await rule.deleteOne();

    await room.updateOne({ ruleCnt: room.ruleCnt - 1 });
  } catch (error) {
    throw error;
  }
};

const createRuleCategory = async (
  userId: string,
  roomId: string,
  ruleCategoryCreateDto: RuleCategoryCreateDto
): Promise<RuleCategoryResponseDto> => {
  try {
    // 유저 존재 여부 확인
    const user = await RuleServiceUtils.findUserById(userId);

    // roomId가 ObjectId 형식인지 확인
    checkObjectIdValidation(roomId);

    // 방 존재 여부 확인
    const room = await RuleServiceUtils.findRoomById(roomId);

    // 참가하고 있는 방이 아니면 접근 불가능
    await RuleServiceUtils.checkForbiddenRoom(user.roomId, room._id);

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

    await room.updateOne({ ruleCategoryCnt: room.ruleCategoryCnt + 1 });

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
    const user = await RuleServiceUtils.findUserById(userId);

    // roomId가 ObjectId 형식인지 확인
    checkObjectIdValidation(roomId);

    // categoryId가 ObjectId 형식인지 확인
    checkObjectIdValidation(categoryId);

    // 방 존재 여부 확인
    const room = await RuleServiceUtils.findRoomById(roomId);

    // 참가하고 있는 방이 아니면 접근 불가능
    await RuleServiceUtils.checkForbiddenRoom(user.roomId, room._id);

    // 규칙 카테고리 존재 여부 확인
    const ruleCategory = await RuleServiceUtils.findRuleCategoryById(
      categoryId
    );

    // 참가하고 있는 방의 규칙 카테고리가 아니면 접근 불가능
    await RuleServiceUtils.checkForbiddenRuleCategory(
      user.roomId,
      ruleCategory.roomId
    );

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

const deleteRuleCategory = async (
  userId: string,
  roomId: string,
  categoryId: string
): Promise<void> => {
  try {
    // roomId가 ObjectId 형식인지 확인
    checkObjectIdValidation(roomId);

    // 유저 존재 여부 확인
    const user = await RuleServiceUtils.findUserById(userId);

    // 방 존재 여부 확인
    const room = await RuleServiceUtils.findRoomById(roomId);

    // 참가하고 있는 방이 아니면 접근 불가능
    await RuleServiceUtils.checkForbiddenRoom(user.roomId, room._id);

    // 규칙 카테고리 존재 여부 확인
    const ruleCategory = await RuleServiceUtils.findRuleCategoryById(
      categoryId
    );

    // 참가하고 있는 방의 규칙 카테고리가 아니면 접근 불가능
    await RuleServiceUtils.checkForbiddenRuleCategory(
      user.roomId,
      ruleCategory.roomId
    );

    // 해당 규칙 카테고리 내부의 모든 규칙들 삭제
    const deletedRules = await Rule.deleteMany({
      roomId: roomId,
      categoryId: categoryId
    });

    // 해당 규칙 카테고리 삭제
    await ruleCategory.deleteOne();

    // 방의 규칙 카테고리 개수 -1, 규책 개수 - 삭제된 규칙 개수
    await room.updateOne({
      ruleCategoryCnt: room.ruleCategoryCnt - 1,
      ruleCnt: room.ruleCnt - deletedRules.deletedCount
    });
  } catch (error) {
    throw error;
  }
};

const getRuleCreateInfo = async (
  userId: string,
  roomId: string
): Promise<RuleCreateInfoResponseDto | null> => {
  try {
    // roomId가 ObjectId 형식인지 확인
    checkObjectIdValidation(roomId);

    // 유저 존재 여부 확인
    const user = await RuleServiceUtils.findUserById(userId);

    // 방 존재 여부 확인
    const room = await RuleServiceUtils.findRoomById(roomId);

    // 참가하고 있는 방이 아니면 접근 불가능
    await RuleServiceUtils.checkForbiddenRoom(user.roomId, room._id);

    const tmpRuleCategories = await RuleCategory.find({
      roomId: roomId
    });

    const ruleCategories: RuleCategories[] = await Promise.all(
      tmpRuleCategories.map(async (ruleCategory: any) => {
        const result = {
          _id: ruleCategory._id,
          categoryName: ruleCategory.categoryName
        };

        return result;
      })
    );

    const tmpHomies = await User.find({
      roomId: roomId
    }).populate('typeId', 'typeColor');

    const homies: Homies[] = await Promise.all(
      tmpHomies.map(async (homie: any) => {
        const result = {
          _id: homie._id,
          name: homie.userName,
          typeColor: homie.typeId.typeColor
        };

        return result;
      })
    );

    const data: RuleCreateInfoResponseDto = {
      ruleCategories: ruleCategories,
      homies: homies
    };

    return data;
  } catch (error) {
    throw error;
  }
};
export default {
  createRule,
  getRuleByRuleId,
  updateRule,
  deleteRule,
  createRuleCategory,
  updateRuleCategory,
  deleteRuleCategory,
  getRuleCreateInfo
};
