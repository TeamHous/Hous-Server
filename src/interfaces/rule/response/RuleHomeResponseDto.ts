import mongoose from 'mongoose';

export interface RuleHomeResponseDto {
  homeRuleCategories: HomeRuleCategories[];
  todayTodoRules: TodayTodoRules[];
}

export interface HomeRuleCategories {
  _id: mongoose.Types.ObjectId;
  categoryName: string;
  categoryIcon: string;
}

export interface HomeRuleCategoriesWithDate extends HomeRuleCategories {
  createdAt: Date;
}

export interface TodayTodoRules {
  _id: mongoose.Types.ObjectId;
  ruleName: string;
  todayMembersWithTypeColor: TodayMembersWithTypeColor[];
  isTmpMember: boolean;
  isAllChecked: boolean;
}

export interface TodayTodoRulesWithDate extends TodayTodoRules {
  createdAt: Date;
}

export interface TodayMembersWithTypeColor {
  userName: string;
  typeColor: string;
}

export interface TodayMembersWithTypeColorWithDate
  extends TodayMembersWithTypeColor {
  typeUpdatedDate: Date;
}
