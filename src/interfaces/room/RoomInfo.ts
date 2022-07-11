import mongoose from 'mongoose';

export interface RoomInfo {
  roomOwner: mongoose.Types.ObjectId;
  roomCode: string;
  userCnt: number;
  eventCnt: number;
  ruleCategoryCnt: number;
}
