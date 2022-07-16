import mongoose from 'mongoose';

export interface RulesByCategoryResponseDto {
  keyRules: KeyRules[];
  rules: Rules[];
}

export interface KeyRules {
  _id: mongoose.Types.ObjectId;
  ruleName: string;
}

export interface KeyRulesWithDate extends KeyRules {
  ruleCreatedDate: Date;
}

export interface RulesWithDate extends KeyRulesWithDate {
  membersCnt: number;
  typeColors: string[];
}

export interface Rules extends KeyRules {
  membersCnt: number;
  typeColors: string[];
}

export interface TypeColors {
  typeColor: string;
  typeUpdatedDate: Date;
}
