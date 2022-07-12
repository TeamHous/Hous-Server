import mongoose from 'mongoose';

export interface RulesByCategoryResponseDto {
  keyRules: KeyRules[];
  rules: Rules[];
}

export interface KeyRules {
  _id: mongoose.Types.ObjectId;
  ruleName: string;
}

export interface Rules extends KeyRules {
  membersCnt: number;
  typeColors: string[];
}
