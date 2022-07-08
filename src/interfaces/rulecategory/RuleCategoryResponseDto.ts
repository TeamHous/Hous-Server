import mongoose from 'mongoose';

export interface RuleCategoryResponseDto {
  _id: mongoose.Types.ObjectId;
  roomId: string;
  ruleCategoryName: string;
  ruleCategoryIcon: string;
}
