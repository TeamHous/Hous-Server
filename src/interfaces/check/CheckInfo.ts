import mongoose from 'mongoose';

export interface CheckInfo {
  userId: mongoose.Types.ObjectId;
  ruleId: mongoose.Types.ObjectId;
  date: Date;
}
