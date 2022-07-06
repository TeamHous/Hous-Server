import mongoose from 'mongoose';

export interface RuleInfo {
  categoryId: mongoose.Types.ObjectId;
  ruleName: String;
  ruleMembers: RuleMembers[];
  tmpRuleMembers: RuleMembers[];
  isKeyRules: Boolean;
  notificationState: Boolean;
  tmpUpdatedDate: Date;
}

interface RuleMembers {
  userId: mongoose.Types.ObjectId;
  day: number[];
}
