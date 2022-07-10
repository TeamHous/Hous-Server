import mongoose from 'mongoose';

export interface RuleCreateInfoResponseDto {
  ruleCategories: RuleCategories[];
  homies: Homies[];
}

interface RuleCategories {
  _id: mongoose.Types.ObjectId;
  categoryName: string;
  categoryIcon: string;
}

interface Homies {
  _id: mongoose.Types.ObjectId;
  name: string;
  typeColor: string;
}
