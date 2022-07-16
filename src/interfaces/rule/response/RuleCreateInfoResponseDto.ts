import mongoose from 'mongoose';

export interface RuleCreateInfoResponseDto {
  ruleCategories: RuleCategories[];
  homies: Homies[];
}

export interface RuleCategories {
  _id: mongoose.Types.ObjectId;
  categoryName: string;
}

export interface Homies {
  _id: mongoose.Types.ObjectId;
  name: string;
  typeColor: string;
}
