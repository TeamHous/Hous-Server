import mongoose from 'mongoose';

export interface RuleCategoryInfo {
  roomId: mongoose.Types.ObjectId;
  categoryName: String;
  categoryIcon: String;
}
