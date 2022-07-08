import mongoose from 'mongoose';

export interface RuleInfo {
  roomId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  ruleName: string;
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
