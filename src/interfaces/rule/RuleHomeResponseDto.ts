import mongoose from 'mongoose';

export interface RuleHomeResponseDto {
  ruleCategories: RuleCategories[];
  todayTodoRules: TodayTodoRules[];
}

export interface RuleCategories {
  categoryName: string;
  categoryIcon: string;
}

export interface TodayTodoRules {
  _id: mongoose.Types.ObjectId;
  ruleName: string;
  todayMembersWithTypeColor: TodayMembersWithTypeColor[];
  isDiff: boolean;
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
