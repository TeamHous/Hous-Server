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
  userName: string;
  typeColor: string;
}

export interface HomiesWithDate extends Homies {
  typeUpdatedDate: Date;
}
