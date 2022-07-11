import mongoose from 'mongoose';
import { Homies, RuleCategories } from './RuleCreateInfoResponseDto';

export interface RuleReadInfoResponseDto {
  rule: RuleReadInfo;
  ruleCategories: RuleCategories[];
  homies: Homies[];
}

export interface RuleReadInfo {
  _id: mongoose.Types.ObjectId;
  notificationState: Boolean;
  ruleName: string;
  ruleCategory: RuleCategories;
  isKeyRules: Boolean;
  ruleMembers: RuleMembers[];
}

export interface RuleMembers {
  homie: Homies;
  day: number[];
}
