import dayjs from 'dayjs';
import errorGenerator from '../../errors/errorGenerator';
import { RuleCreateDto } from '../../interfaces/rule/RuleCreateDto';
import { RuleResponseDto } from '../../interfaces/rule/RuleResponseDto';
import { RuleTodoCheckUpdateDto } from '../../interfaces/rule/RuleTodoCheckUpdateDto';
import { RuleTodoCheckUpdateResponseDto } from '../../interfaces/rule/RuleTodoCheckUpdateResponseDto';
import { RuleUpdateDto } from '../../interfaces/rule/RuleUpdateDto';
import { TmpRuleMembersUpdateDto } from '../../interfaces/rule/TmpRuleMembersUpdateDto';
import { TmpRuleMembersUpdateResponseDto } from '../../interfaces/rule/TmpRuleMembersUpdateResponseDto';
import { RuleCategoryCreateDto } from '../../interfaces/rulecategory/RuleCategoryCreateDto';
import { RuleCategoryResponseDto } from '../../interfaces/rulecategory/RuleCategoryResponseDto';
import { RuleCategoryUpdateDto } from '../../interfaces/rulecategory/RuleCategoryUpdateDto';
import Check from '../../models/Check';
import Rule from '../../models/Rule';
import RuleCategory from '../../models/RuleCategory';
import checkIconType from '../../modules/checkIconType';
import checkObjectIdValidation from '../../modules/checkObjectIdValidation';
import checkValidUtils from '../../modules/checkValidUtils';
import limitNum from '../../modules/limitNum';
import message from '../../modules/responseMessage';
import statusCode from '../../modules/statusCode';
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

    // 규칙 카테고리 존재 여부 확인
    const ruleCategory = await RuleServiceUtils.findRuleCategoryById(
      ruleCreateDto.categoryId
    );

    // 참가하고 있는 방의 규칙 카테고리가 아니면 접근 불가능
    await RuleServiceUtils.checkForbiddenRuleCategory(
      user.roomId,
      ruleCategory.roomId
    );

    // 카테고리 별 규칙 개수 확인
    checkValidUtils.checkCountLimit(ruleCategory.ruleCnt, limitNum.RULE_CNT);

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
      tmpUpdatedDate: dayjs().subtract(10, 'day').format('YYYY-MM-DD')
    });

    await rule.save();

    await ruleCategory.updateOne({ ruleCnt: ruleCategory.ruleCnt + 1 });

    return rule;
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

    // 규칙 카테고리 존재 여부 확인
    const ruleCategory = await RuleServiceUtils.findRuleCategoryById(
      ruleUpdateDto.categoryId
    );

    // 참가하고 있는 방의 규칙 카테고리가 아니면 접근 불가능
    await RuleServiceUtils.checkForbiddenRuleCategory(
      user.roomId,
      ruleCategory.roomId
    );

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

    // 규칙 카테고리 가져오기
    const ruleCategory = await RuleServiceUtils.findRuleCategoryById(
      rule.categoryId.toString()
    );

    // 규칙과 관련된 check 삭제
    const checks = await Check.find({ ruleId: rule._id });
    for (const check of checks) {
      await check.deleteOne();
    }

    await rule.deleteOne();

    await ruleCategory.updateOne({ ruleCnt: ruleCategory.ruleCnt - 1 });
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
      ruleCategoryIcon: ruleCategory.categoryIcon,
      ruleCnt: ruleCategory.ruleCnt
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
): Promise<RuleCategoryResponseDto> => {
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

    await ruleCategory.updateOne(ruleCategoryUpdateDto);

    const data: RuleCategoryResponseDto = {
      _id: categoryId,
      roomId: roomId,
      ruleCategoryName: ruleCategoryUpdateDto.categoryName,
      ruleCategoryIcon: ruleCategoryUpdateDto.categoryIcon,
      ruleCnt: ruleCategory.ruleCnt
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

    // 해당 규칙 카테고리 내부의 모든 규칙들 삭제
    const deletedRules = await Rule.deleteMany({
      roomId: roomId,
      categoryId: categoryId
    });

    // 해당 규칙 카테고리 삭제
    await ruleCategory.deleteOne();

    // 방의 규칙 카테고리 개수 -1
    await room.updateOne({
      ruleCategoryCnt: room.ruleCategoryCnt - 1
    });
  } catch (error) {
    throw error;
  }
};

const updateTmpRuleMembers = async (
  userId: string,
  roomId: string,
  ruleId: string,
  tmpRuleMembersUpdateDto: TmpRuleMembersUpdateDto
): Promise<TmpRuleMembersUpdateResponseDto> => {
  try {
    // 유저 존재 여부 확인
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

    await Promise.all(
      tmpRuleMembersUpdateDto.tmpRuleMembers.map(async (ruleMemberId: any) => {
        // tmpRuleMember로 설정할 유저 존재 확인
        const ruleMember = await RuleServiceUtils.findUserById(ruleMemberId);
        // 방에 참가하고 있는 tmpRuleMember가 아니라면 설정 불가능
        await RuleServiceUtils.checkForbiddenRoom(ruleMember.roomId, room._id);
      })
    );

    await rule.updateOne({
      tmpRuleMembers: tmpRuleMembersUpdateDto.tmpRuleMembers,
      tmpUpdatedDate: dayjs().format('YYYY-MM-DD')
    });

    const data: TmpRuleMembersUpdateResponseDto = {
      _id: rule._id,
      ruleName: rule.ruleName,
      tmpRuleMembers: tmpRuleMembersUpdateDto.tmpRuleMembers
    };

    return data;
  } catch (error) {
    throw error;
  }
};

const updateMyRuleTodoCheck = async (
  userId: string,
  roomId: string,
  ruleId: string,
  ruleTodoCheckUpdateDto: RuleTodoCheckUpdateDto
): Promise<RuleTodoCheckUpdateResponseDto> => {
  try {
    // 유저 존재 여부 확인
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

    // 해당 규칙의 오늘 담당자에 유저가 있는지 확인
    let isMemberOfToday: boolean = false;

    if (dayjs().isSame(rule.tmpUpdatedDate, 'day')) {
      // tmpUpdatedDate === 오늘 -> 임시 담당자 확인
      for (const userId of rule.tmpRuleMembers) {
        if (userId.equals(user._id)) {
          isMemberOfToday = true;
          break;
        }
      }
    } else {
      // tmpUpdatedDate !== 오늘 -> 고정 담당자 확인
      for (const member of rule.ruleMembers) {
        if (
          member.userId.equals(user._id) &&
          member.day.includes(dayjs().day())
        ) {
          isMemberOfToday = true;
          break;
        }
      }
    }
    let data: RuleTodoCheckUpdateResponseDto;

    // 해당 규칙의 오늘 담당자에 유저가 있다면 체크 수정, 없다면
    if (isMemberOfToday) {
      // 체크 O로 수정
      if (ruleTodoCheckUpdateDto.isCheck) {
        const checks = await Check.find({
          ruleId: ruleId,
          userId: userId,
          date: dayjs().format('YYYY-MM-DD')
        });

        // 1개 이상인 경우 for 문 동작
        // 0개 일 경우 for문 건너뜀
        for (const check of checks) {
          await check.deleteOne();
        }

        // 오늘 날짜로 체크 생성
        const check = new Check({
          userId: userId,
          ruleId: ruleId,
          date: dayjs().format('YYYY-MM-DD')
        });

        await check.save();

        // 이미 true 인데 true 요청을 받은 경우
        if (checks.length > 0) {
          throw errorGenerator({
            msg: message.BAD_REQUEST,
            statusCode: statusCode.BAD_REQUEST
          });
        }

        data = {
          isCheck: true
        };
      } else {
        // 체크 X로 수정
        const checks = await Check.find({
          ruleId: ruleId,
          userId: userId
        });

        let isAlreadyUnChecked: boolean = true;

        for (const check of checks) {
          if (dayjs(check.date).isSame(dayjs().format('YYYY-MM-DD'))) {
            isAlreadyUnChecked = false;
            break;
          }
        }

        // 이미 false인데 false 요청을 받은 경우
        if (isAlreadyUnChecked) {
          throw errorGenerator({
            msg: message.BAD_REQUEST,
            statusCode: statusCode.BAD_REQUEST
          });
        }

        // 존재하는 check 들 모두 삭제
        for (const check of checks) {
          await check.deleteOne();
        }

        data = {
          isCheck: false
        };
      }
    } else {
      // 오늘의 임시 담당자 및 고정 담당자에서 유저를 찾지 못했을 경우
      throw errorGenerator({
        msg: message.NOT_FOUND_USER_AT_TODAY_RULE_MEMBERS,
        statusCode: statusCode.NOT_FOUND
      });
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export default {
  createRule,
  updateRule,
  deleteRule,
  createRuleCategory,
  updateRuleCategory,
  deleteRuleCategory,
  updateTmpRuleMembers,
  updateMyRuleTodoCheck
};
