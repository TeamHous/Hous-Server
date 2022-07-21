import dayjs from 'dayjs';
import {
  HomiesWithIsTmpMember,
  HomiesWithIsTmpMemberResponseDto,
  HomiesWithIsTmpMemberWithDate
} from '../../interfaces/rule/response/HomiesWithIsTmpMemberResponseDto';
import {
  Homies,
  HomiesWithDate,
  RuleCategories,
  RuleCreateInfoResponseDto
} from '../../interfaces/rule/response/RuleCreateInfoResponseDto';
import {
  HomeRuleCategories,
  HomeRuleCategoriesWithDate,
  RuleHomeResponseDto,
  TodayMembersWithTypeColor,
  TodayMembersWithTypeColorWithDate,
  TodayTodoRules,
  TodayTodoRulesWithDate
} from '../../interfaces/rule/response/RuleHomeResponseDto';
import {
  RuleMyTodoResponseDto,
  RuleMyTodoWithDateResponseDto
} from '../../interfaces/rule/response/RuleMyTodoResponseDto';
import {
  RuleMembers,
  RuleReadInfo,
  RuleReadInfoResponseDto
} from '../../interfaces/rule/response/RuleReadInfoResponseDto';
import {
  KeyRules,
  KeyRulesWithDate,
  Rules,
  RulesByCategoryResponseDto,
  RulesWithDate,
  TypeColors
} from '../../interfaces/rule/response/RulesByCategoryResponseDto';
import Check from '../../models/Check';
import Rule from '../../models/Rule';
import RuleCategory from '../../models/RuleCategory';
import User from '../../models/User';
import checkObjectIdValidation from '../../modules/checkObjectIdValidation';
import limitNum from '../../modules/limitNum';
import RuleServiceUtils from './RuleServiceUtils';

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
          userName: homie.userName,
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
            userName: (ruleMember.userId as any).userName,
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
    })
      .populate('typeId', 'typeColor')
      .sort({ typeUpdatedDate: 1 });

    const homiesWithDate: HomiesWithDate[] = [];
    const homiesWithNullDate: HomiesWithDate[] = [];
    await Promise.all(
      tmpHomies.map(async (homie: any) => {
        if (homie.typeUpdatedDate != null) {
          homiesWithDate.push({
            _id: homie._id,
            userName: homie.userName,
            typeColor: homie.typeId.typeColor,
            typeUpdatedDate: homie.typeUpdatedDate
          });
        } else {
          homiesWithNullDate.push({
            _id: homie._id,
            userName: homie.userName,
            typeColor: homie.typeId.typeColor,
            typeUpdatedDate: homie.typeUpdatedDate
          });
        }
      })
    );

    const homies: Homies[] = homiesWithDate
      .concat(homiesWithNullDate)
      .map(({ typeUpdatedDate, ...rest }) => {
        return rest;
      });

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
          const typeColorsWithNoDate: TypeColors[] = [];

          await Promise.all(
            tmpRule.ruleMembers.map(async (ruleMember: any) => {
              if (ruleMember.userId !== null) {
                // 성향 검사 일시가 null 이 아닐 경우
                if (ruleMember.userId.typeUpdatedDate !== null) {
                  typeColorsWithDate.push({
                    typeColor: ruleMember.userId.typeId.typeColor,
                    typeUpdatedDate: ruleMember.userId.typeUpdatedDate
                  });
                } else {
                  // 성향 검사 일시가 null일 경우
                  typeColorsWithNoDate.push({
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

          const typeColorsAllWithDate =
            typeColorsWithDate.concat(typeColorsWithNoDate);

          // 최종 typeColors의 length를 최대 3으로 자르고 Date 지우기
          const typeColors: string[] = typeColorsAllWithDate
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

    const tmpHomies = await User.find({
      roomId: roomId
    })
      .populate('typeId', 'typeColor')
      .sort({ typeUpdatedDate: 1 });

    let homiesWithIsTmpMembersWithDate: HomiesWithIsTmpMemberWithDate[];

    // tmpUpdatedDate === 오늘 -> tmpRuleMembers에 있는 유저는 isChecked = true
    if (dayjs().isSame(rule.tmpUpdatedDate, 'day')) {
      homiesWithIsTmpMembersWithDate = await Promise.all(
        tmpHomies.map(async (homie: any) => {
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
            typeColor: homie.typeId.typeColor as string,
            typeUpdatedDate: homie.typeUpdatedDate
          };
        })
      );
    } else {
      // tmpUpdatedDate !== 오늘 -> 고정 담당자 리스트에 있는 유저만 isChecked = true
      homiesWithIsTmpMembersWithDate = await Promise.all(
        tmpHomies.map(async (homie: any) => {
          let isChecked: boolean = false;

          for (const member of rule.ruleMembers) {
            if (
              homie._id.equals(member.userId) &&
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
            typeColor: homie.typeId.typeColor as string,
            typeUpdatedDate: homie.typeUpdatedDate
          };
        })
      );
    }

    const homiesWithIsCheckedWithDate: HomiesWithIsTmpMemberWithDate[] = [];
    const homiesWithIsCheckedWithNullDate: HomiesWithIsTmpMemberWithDate[] = [];
    await Promise.all(
      homiesWithIsTmpMembersWithDate.map(async (homie: any) => {
        if (homie.typeUpdatedDate != null) {
          homiesWithIsCheckedWithDate.push({
            _id: homie._id,
            userName: homie.userName,
            isChecked: homie.isChecked,
            typeColor: homie.typeColor,
            typeUpdatedDate: homie.typeUpdatedDate
          });
        } else {
          homiesWithIsCheckedWithNullDate.push({
            _id: homie._id,
            userName: homie.userName,
            isChecked: homie.isChecked,
            typeColor: homie.typeColor,
            typeUpdatedDate: homie.typeUpdatedDate
          });
        }
      })
    );

    const homies: HomiesWithIsTmpMember[] = homiesWithIsCheckedWithDate
      .concat(homiesWithIsCheckedWithNullDate)
      .map(({ typeUpdatedDate, ...rest }) => {
        return rest;
      });

    const data: HomiesWithIsTmpMemberResponseDto = {
      _id: ruleId,
      homies: homies
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

    let dataWithDate: RuleMyTodoWithDateResponseDto[] = [];

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
          const myToDoInfo: RuleMyTodoWithDateResponseDto = {
            _id: tmpRule._id,
            categoryIcon: tmpRule.categoryId.categoryIcon,
            ruleName: tmpRule.ruleName,
            isChecked: isChecked,
            createdAt: tmpRule.createdAt // 정렬 목적이라 +9시간 생략
          };

          dataWithDate.push(myToDoInfo);
        }
      })
    );

    dataWithDate.sort((before, current) => {
      return dayjs(before.createdAt).isAfter(dayjs(current.createdAt)) ? 1 : -1;
    });

    const data: RuleMyTodoResponseDto[] = dataWithDate.map(
      ({ createdAt, ...rest }) => {
        return rest;
      }
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
            if (
              ruleMember.day.includes(dayjs().day()) &&
              ruleMember.userId != null
            ) {
              originalTodayMembers.push(ruleMember.userId.toString());
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
                userId: tmpMember._id
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
                !originalTodayMembers.includes(tmpMember._id.toString())
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

        // 성향 오름차순으로 정렬
        todayMembersWithTypeColorWithDate.sort((before, current) => {
          return dayjs(before.typeUpdatedDate).isAfter(
            dayjs(current.typeUpdatedDate)
          )
            ? 1
            : -1;
        });

        // 규칙 리스트 : 성향 테스트한 사람(시간 기준, 오름차순 정렬) + 성향 테스트를 안한 사람
        const todayMemberAllWithDate = todayMembersWithTypeColorWithDate.concat(
          todayMembersWithTypeColorNoDate
        );

        const todayMembersWithTypeColor: TodayMembersWithTypeColor[] =
          todayMemberAllWithDate.map(({ typeUpdatedDate, ...rest }) => {
            return rest;
          });

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
  getRuleByRuleId,
  getRuleCreateInfo,
  getRulesByCategoryId,
  getHomiesWithIsTmpMember,
  getMyRuleInfo,
  getRuleInfoAtRuleHome
};
