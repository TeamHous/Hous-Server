export interface RuleCreateDto {
  notificationState: boolean;
  ruleName: string;
  categoryId: string;
  isKeyRules: boolean;
  ruleMembers: RuleMembers[];
}

interface RuleMembers {
  userId: string;
  day: number[];
}
