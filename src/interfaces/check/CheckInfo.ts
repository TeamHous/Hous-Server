import mongoose from 'mongoose';

export interface CheckInfo {
  roomId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  ruleId: mongoose.Types.ObjectId;
  date: Date;
}
