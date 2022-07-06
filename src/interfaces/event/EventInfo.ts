import mongoose from 'mongoose';

export interface EventInfo {
  eventName: String;
  eventIcon: String;
  date: Date;
  participantsId: mongoose.Types.ObjectId[];
}
