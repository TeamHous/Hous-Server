import mongoose from 'mongoose';

export interface RoomInfo {
  roomCode: String;
  ruleCategoriesId: mongoose.Types.ObjectId[];
  rulesId: mongoose.Types.ObjectId[];
  usersId: mongoose.Types.ObjectId[];
  eventsId: mongoose.Types.ObjectId[];
  checksId: mongoose.Types.ObjectId[];
}
