import dayjs from 'dayjs';
import errorGenerator from '../errors/errorGenerator';
import {
  HomiesWithIsTmpMember,
  HomiesWithIsTmpMemberResponseDto,
  HomiesWithIsTmpMemberWithDate
} from '../interfaces/rule/HomiesWithIsTmpMemberResponseDto';
import { RuleCreateDto } from '../interfaces/rule/RuleCreateDto';
import {
  Homies,
  RuleCategories,
  RuleCreateInfoResponseDto
} from '../interfaces/rule/RuleCreateInfoResponseDto';
import {
  HomeRuleCategories,
  HomeRuleCategoriesWithDate,
  RuleHomeResponseDto,
  TodayMembersWithTypeColor,
  TodayMembersWithTypeColorWithDate,
  TodayTodoRules,
  TodayTodoRulesWithDate
} from '../interfaces/rule/RuleHomeResponseDto';
import { RuleMyTodoResponseDto } from '../interfaces/rule/RuleMyTodoResponseDto';
import {
  RuleMembers,
  RuleReadInfo,
  RuleReadInfoResponseDto
} from '../interfaces/rule/RuleReadInfoResponseDto';
import { RuleResponseDto } from '../interfaces/rule/RuleResponseDto';
import {
  KeyRules,
  KeyRulesWithDate,
  Rules,
  RulesByCategoryResponseDto,
  RulesWithDate,
  TypeColors
} from '../interfaces/rule/RulesByCategoryResponseDto';
import { RuleUpdateDto } from '../interfaces/rule/RuleUpdateDto';
import { TmpRuleMembersUpdateDto } from '../interfaces/rule/TmpRuleMembersUpdateDto';
import { TmpRuleMembersUpdateResponseDto } from '../interfaces/rule/TmpRuleMembersUpdateResponseDto';
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

const getRuleCreateInfo = async (
  userId: string,
  roomId: string
): Promise<RuleCreateInfoResponseDto> => {
  try {
    // 유저 존재 여부 확인
    const user = await RuleServiceUtils.findUserById(userId);

    // roomId가 ObjectId 형식인지 확인
    checkObjectIdValidation(roomId);

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

const getRulesByCategoryId = async (
  userId: string,
  roomId: string,
  categoryId: string
): Promise<RulesByCategoryResponseDto> => {
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

    const tmpRules = await Rule.find({
      roomId: roomId,
      categoryId: categoryId
    });

    const keyRulesWithDate: KeyRulesWithDate[] = [];
    const rulesWithDate: RulesWithDate[] = [];

    await Promise.all(
      tmpRules.map(async (tmpRule: any) => {
        // isKeyRules가 true라면 상단 KeyRules로 추가
        if (tmpRule.isKeyRules === true) {
          const keyRule: KeyRulesWithDate = {
            _id: tmpRule._id,
            ruleName: tmpRule.ruleName,
            ruleCreatedDate: tmpRule.createdAt // 정렬용으로만 사용해서 +9시간 생략
          };

          keyRulesWithDate.push(keyRule);
        } else {
          // isKeyRules가 flase라면 상단 KeyRules로 추가
          await tmpRule.populate(
            'ruleMembers.userId',
            'typeId typeUpdatedDate'
          );
          await tmpRule.populate('ruleMembers.userId.typeId', 'typeColor ');

          const typeColorsWithDate: TypeColors[] = [];

          await Promise.all(
            tmpRule.ruleMembers.map(async (ruleMember: any) => {
              if (ruleMember.userId !== null) {
                // 성향 검사 일시가 null 이 아닐 경우 -> 성향 존재한다는 것
                if (ruleMember.userId.typeUpdateDate !== null) {
                  typeColorsWithDate.push({
                    typeColor: ruleMember.userId.typeId.typeColor,
                    typeUpdatedDate: ruleMember.userId.typeUpdatedDate
                  });
                }
              }
            })
          );

          // typeColors -> 성향테스트 참여한 순서대로 오름차순 정렬
          // before 값이 current 값보다 크면 양수, 작으면 음수를 return
          typeColorsWithDate.sort((before, current) => {
            return dayjs(before.typeUpdatedDate).isAfter(
              dayjs(current.typeUpdatedDate)
            )
              ? 1
              : -1;
          });

          // 최종 typeColors의 length를 최대 3으로 자르고 Date 지우기
          const typeColors: string[] = typeColorsWithDate
            .slice(0, limitNum.TYPES_AT_RULE_BY_CATEGORY_CNT)
            .map((typeColor: TypeColors) => {
              return typeColor.typeColor;
            });

          const rule: RulesWithDate = {
            _id: tmpRule._id,
            ruleName: tmpRule.ruleName,
            ruleCreatedDate: tmpRule.createdAt, // 정렬용으로만 사용해서 +9시간 생략
            membersCnt: tmpRule.ruleMembers.length,
            typeColors: typeColors
          };

          rulesWithDate.push(rule);
        }
      })
    );

    // keyRules -> keyRules 추가된 순서대로 오름차순 정렬
    // before 값이 current 값보다 크면 양수, 작으면 음수를 return
    keyRulesWithDate.sort((before, current) => {
      return dayjs(before.ruleCreatedDate).isAfter(
        dayjs(current.ruleCreatedDate)
      )
        ? 1
        : -1;
    });

    // rules -> rules 추가된 순서대로 오름차순 정렬
    // before 값이 current 값보다 크면 양수, 작으면 음수를 return
    rulesWithDate.sort((before, current) => {
      return dayjs(before.ruleCreatedDate).isAfter(
        dayjs(current.ruleCreatedDate)
      )
        ? 1
        : -1;
    });

    // 최종 keyRules에서 Date 지우기
    const keyRules: KeyRules[] = keyRulesWithDate.map(
      ({ ruleCreatedDate, ...rest }) => {
        return rest;
      }
    );

    // 최종 rules에서 Date 지우기
    const rules: Rules[] = rulesWithDate.map(({ ruleCreatedDate, ...rest }) => {
      return rest;
    });

    const data: RulesByCategoryResponseDto = {
      keyRules: keyRules,
      rules: rules
    };

    return data;
  } catch (error) {
    throw error;
  }
};

const getHomiesWithIsTmpMember = async (
  userId: string,
  roomId: string,
  ruleId: string
): Promise<HomiesWithIsTmpMemberResponseDto> => {
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

    const homies = await User.find({
      roomId: roomId
    }).populate('typeId', 'typeColor');

    let homiesWithIsTmpMembersWithDate: HomiesWithIsTmpMemberWithDate[];

    // tmpUpdatedDate === 오늘 -> tmpRuleMembers에 있는 유저는 isChecked = true
    if (dayjs().isSame(rule.tmpUpdatedDate, 'day')) {
      homiesWithIsTmpMembersWithDate = await Promise.all(
        homies.map(async (homie: any) => {
          let isChecked: boolean = false;
          for (const userId of rule.tmpRuleMembers) {
            if (userId.equals(homie._id)) {
              isChecked = true;
              break;
            }
          }

          return {
            _id: homie._id as string,
            userName: homie.userName as string,
            isChecked: isChecked,
            typeColor: (homie.typeId as any).typeColor as string,
            typeUpdatedDate: homie.typeUpdatedDate
          };
        })
      );
    } else {
      // tmpUpdatedDate !== 오늘 -> 고정 담당자 리스트에 있는 유저만 isChecked = true
      homiesWithIsTmpMembersWithDate = await Promise.all(
        homies.map(async (homie: any) => {
          let isChecked: boolean = false;

          for (const member of rule.ruleMembers) {
            if (
              member.userId.equals(homie._id) &&
              member.day.includes(dayjs().day())
            ) {
              isChecked = true;
              break;
            }
          }

          return {
            _id: homie._id as string,
            userName: homie.userName as string,
            isChecked: isChecked,
            typeColor: (homie.typeId as any).typeColor as string,
            typeUpdatedDate: homie.typeUpdatedDate
          };
        })
      );
    }

    homiesWithIsTmpMembersWithDate.sort((before, current) => {
      return dayjs(before.typeUpdatedDate).isAfter(
        dayjs(current.typeUpdatedDate)
      )
        ? 1
        : -1;
    });

    const homiesWithIsTmpMembers: HomiesWithIsTmpMember[] =
      homiesWithIsTmpMembersWithDate.map(({ typeUpdatedDate, ...rest }) => {
        return rest;
      });

    const data: HomiesWithIsTmpMemberResponseDto = {
      _id: ruleId,
      homies: homiesWithIsTmpMembers
    };

    return data;
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

const getMyRuleInfo = async (
  userId: string,
  roomId: string
): Promise<RuleMyTodoResponseDto[]> => {
  try {
    // 유저 존재 여부 확인
    const user = await RuleServiceUtils.findUserById(userId);

    // roomId가 ObjectId 형식인지 확인
    checkObjectIdValidation(roomId);

    // 방 존재 여부 확인
    const room = await RuleServiceUtils.findRoomById(roomId);

    // 참가하고 있는 방이 아니면 접근 불가능
    await RuleServiceUtils.checkForbiddenRoom(user.roomId, room._id);

    // 방에 포함되고 keyRules가 아닌 규칙들 조회
    const tmpRules = await Rule.find({
      roomId: roomId,
      isKeyRules: false
    });

    let data: RuleMyTodoResponseDto[] = [];

    await Promise.all(
      tmpRules.map(async (tmpRule: any) => {
        // 고정담당자, 임시담당자 중 어떤 걸 확인해야하는지 결정
        const tmpUpdatedToday: boolean = dayjs().isSame(
          tmpRule.tmpUpdatedDate,
          'day'
        );

        let ruleMembers = []; // ruleMembers, tmpRuleMembers를 담는 리스트

        if (!tmpUpdatedToday) {
          // 고정담당자를 확인해야 하는 경우
          ruleMembers = tmpRule.ruleMembers;
        } else {
          // 임시담당자를 확인해야 하는 경우
          ruleMembers = tmpRule.tmpRuleMembers;
        }

        // 내가 포함되고 오늘의 규칙인지 확인
        let flag = false;
        if (!tmpUpdatedToday) {
          // 고정담당자를 확인해야 하는 경우
          for (const member of ruleMembers) {
            // ruleMembers를 담는 리스트
            if (member.userId != null && member.userId.toString() == userId) {
              // 내가 포함된 경우
              if (member.day.includes(dayjs().day())) {
                flag = true;
              }
            }
          }
        } else {
          // 임시담당자를 확인해야 하는 경우
          for (const member of ruleMembers) {
            // tmpRuleMembers를 담는 리스트
            if (member != null && member.toString() == userId) {
              // 내가 포함된 경우
              flag = true;
            }
          }
        }

        // 오늘 나의 규칙인 경우 체크 여부 확인
        if (flag) {
          const checks = await Check.find({
            userId: userId,
            ruleId: tmpRule._id
          });

          let isChecked: boolean = false;

          for (const check of checks) {
            if (dayjs().isSame(check.date, 'day')) {
              isChecked = true;
              break;
            }
          }

          await tmpRule.populate('categoryId', 'categoryIcon');
          const myToDoInfo: RuleMyTodoResponseDto = {
            _id: tmpRule._id,
            categoryIcon: tmpRule.categoryId.categoryIcon,
            ruleName: tmpRule.ruleName,
            isChecked: isChecked
          };

          data.push(myToDoInfo);
        }
      })
    );

    return data;
  } catch (error) {
    throw error;
  }
};

const getRuleInfoAtRuleHome = async (
  userId: string,
  roomId: string
): Promise<RuleHomeResponseDto> => {
  try {
    // 유저 존재 여부 확인
    const user = await RuleServiceUtils.findUserById(userId);

    // roomId가 ObjectId 형식인지 확인
    checkObjectIdValidation(roomId);

    // 방 존재 여부 확인
    const room = await RuleServiceUtils.findRoomById(roomId);

    // 참가하고 있는 방이 아니면 접근 불가능
    await RuleServiceUtils.checkForbiddenRoom(user.roomId, room._id);

    // 규칙 카테고리 조회
    const tmpRuleCategoryList = await RuleCategory.find({
      roomId: roomId
    });

    const ruleCategoryListWithDate: HomeRuleCategoriesWithDate[] =
      await Promise.all(
        tmpRuleCategoryList.map((ruleCategory: any) => {
          const result = {
            _id: ruleCategory._id,
            categoryIcon: ruleCategory.categoryIcon,
            categoryName: ruleCategory.categoryName,
            createdAt: (ruleCategory as any).createdAt
          };
          return result;
        })
      );

    const ruleCategoryList: HomeRuleCategories[] = ruleCategoryListWithDate.map(
      // 규칙 카테고리 리스트에서 시간 삭제
      ({ createdAt, ...rest }) => {
        return rest;
      }
    );

    const rules = await Rule.find({
      roomId: roomId,
      isKeyRules: false
    });

    const todayTodoRulesWithDate: TodayTodoRulesWithDate[] = [];

    await Promise.all(
      rules.map(async (rule: any) => {
        // 오늘의 고정 담당자 구하기
        const originalTodayMembers: string[] = [];
        await Promise.all(
          rule.ruleMembers.map(async (ruleMember: any) => {
            console.log(ruleMember.userId);
            console.log(ruleMember.day);
            if (ruleMember.day.includes(dayjs().day())) {
              originalTodayMembers.push(ruleMember.userId);
            }
          })
        );

        let isTmpMember = false;
        const todayMembersWithTypeColorWithDate: TodayMembersWithTypeColorWithDate[] =
          [];
        const todayMembersWithTypeColorNoDate: TodayMembersWithTypeColorWithDate[] =
          [];
        let isAllChecked: boolean = false;
        let checkCnt: number = 0;

        // tmpUpdatedDate == 오늘 -> tmpRuleMembers 탐색
        if (dayjs().isSame(rule.tmpUpdatedDate, 'day')) {
          await rule.populate(
            'tmpRuleMembers',
            'userName typeId typeUpdatedDate'
          );
          await rule.populate('tmpRuleMembers.typeId', 'typeColor');

          await Promise.all(
            rule.tmpRuleMembers.map(async (tmpMember: any) => {
              const checks = await Check.find({
                ruleId: rule._id,
                userId: tmpMember.userId
              });

              let isChecked: boolean = false;
              for (const check of checks) {
                if (dayjs().isSame(check.date, 'day')) {
                  isChecked = true;
                  break;
                }
              }

              // 성향 검사 일시가 null 이 아닐 경우
              if (tmpMember.typeUpdatedDate !== null) {
                todayMembersWithTypeColorWithDate.push({
                  userName: tmpMember.userName,
                  typeColor: tmpMember.typeId.typeColor,
                  typeUpdatedDate: tmpMember.typeUpdatedDate
                });
              } else {
                // 성향 검사 일시가 null 일 경우
                todayMembersWithTypeColorNoDate.push({
                  userName: tmpMember.userName,
                  typeColor: tmpMember.typeId.typeColor,
                  typeUpdatedDate: tmpMember.typeUpdatedDate
                });
              }

              // 오늘의 임시 담당자와 고정 담당자 비교
              if (
                !isTmpMember &&
                !originalTodayMembers.includes(tmpMember.toString())
              ) {
                isTmpMember = true;
              }

              if (isChecked) {
                checkCnt++;
              }
            })
          );

          // 규칙의 유저별로 체크여부 확인 ++,
          // ++한 값 === rule.ruleMembers의 길이랑 같다면 isAllChecked = true
          if (checkCnt === rule.tmpRuleMembers.length) {
            isAllChecked = true;
            checkCnt = 0; // 다시 초기화
          }
        } else {
          // tmpUpdatedDate != 오늘 -> ruleMembers 탐색
          await rule.populate(
            'ruleMembers.userId',
            'userName typeId typeUpdatedDate'
          );
          await rule.populate('ruleMembers.userId.typeId', 'typeColor');

          await Promise.all(
            rule.ruleMembers.map(async (member: any) => {
              // 오늘 요일의 고정담당이 존재할 경우
              if (member.userId != null && member.day.includes(dayjs().day())) {
                // 성향 검사 일시가 null 이 아닐 경우
                if (member.userId.typeUpdatedDate !== null) {
                  todayMembersWithTypeColorWithDate.push({
                    userName: member.userId.userName,
                    typeColor: member.userId.typeId.typeColor,
                    typeUpdatedDate: member.typeUpdatedDate
                  });
                } else {
                  // 성향 검사 일시가 null 일 경우
                  todayMembersWithTypeColorNoDate.push({
                    userName: member.userId.userName,
                    typeColor: member.userId.typeId.typeColor,
                    typeUpdatedDate: member.typeUpdatedDate
                  });
                }

                const checks = await Check.find({
                  ruleId: rule._id,
                  userId: member.userId
                });

                let isChecked: boolean = false;
                for (const check of checks) {
                  if (dayjs().isSame(check.date, 'day')) {
                    isChecked = true;
                    break;
                  }
                }

                if (isChecked) {
                  checkCnt++;
                }
              }
              // 오늘의 임시 담당자와 고정 담당자 비교 필요 없음
            })
          );

          // 규칙의 유저별로 체크여부 확인 ++,
          // ++한 값 === rule.ruleMembers의 길이랑 같다면 isAllChecked = true
          if (checkCnt === rule.ruleMembers.length) {
            isAllChecked = true;
            checkCnt = 0; // 다시 초기화
          }
        }

        const todayMemberAllWithDate = todayMembersWithTypeColorWithDate.concat(
          todayMembersWithTypeColorNoDate
        );

        // 성향 오름차순으로 정렬
        todayMembersWithTypeColorWithDate.sort((before, current) => {
          return dayjs(before.typeUpdatedDate).isAfter(
            dayjs(current.typeUpdatedDate)
          )
            ? 1
            : -1;
        });

        const todayMembersWithTypeColor: TodayMembersWithTypeColor[] =
          todayMembersWithTypeColorWithDate.map(
            ({ typeUpdatedDate, ...rest }) => {
              return rest;
            }
          );

        todayTodoRulesWithDate.push({
          _id: rule._id,
          ruleName: rule.ruleName,
          todayMembersWithTypeColor: todayMembersWithTypeColor,
          isTmpMember: isTmpMember,
          isAllChecked: isAllChecked,
          createdAt: rule.createdAt // 정렬을 위해 사용할거라 +9 안함
        });
      })
    );

    todayTodoRulesWithDate.sort((before, current) => {
      return dayjs(before.createdAt).isAfter(dayjs(current.createdAt)) ? 1 : -1;
    });

    const todayTodoRules: TodayTodoRules[] = todayTodoRulesWithDate.map(
      ({ createdAt, ...rest }) => {
        return rest;
      }
    );

    const keyRules: TodayTodoRules[] = [];
    const todoRules: TodayTodoRules[] = [];
    await Promise.all(
      todayTodoRules.map(async (todoRule: any) => {
        if (todoRule.todayMembersWithTypeColor.length == 0) {
          keyRules.push(todoRule);
        } else {
          todoRules.push(todoRule);
        }
      })
    );

    const data: RuleHomeResponseDto = {
      homeRuleCategories: ruleCategoryList,
      todayTodoRules: keyRules.concat(todoRules)
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
  getRuleCreateInfo,
  getRulesByCategoryId,
  getHomiesWithIsTmpMember,
  updateTmpRuleMembers,
  getMyRuleInfo,
  getRuleInfoAtRuleHome
};
