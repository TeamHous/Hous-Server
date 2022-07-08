import mongoose from 'mongoose';

export interface RuleCategoryInfo {
  roomId: mongoose.Types.ObjectId;
  categoryName: string;
  categoryIcon: string;
}
