import mongoose from 'mongoose';

export interface EventInfo {
  roomId: mongoose.Types.ObjectId;
  participantsId: mongoose.Types.ObjectId[];
  eventName: string;
  eventIcon: string;
  date: Date;
}
