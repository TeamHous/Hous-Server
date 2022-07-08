import mongoose from 'mongoose';
import { RoomInfo } from '../interfaces/room/RoomInfo';

const RoomSchema = new mongoose.Schema(
  {
    roomOwner: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    roomCode: {
      type: String,
      required: true,
      unique: true
    },
    userCnt: {
      type: Number,
      required: false,
      default: 1
    },
    eventCnt: {
      type: Number,
      required: false,
      default: 0
    },
    ruleCategoryCnt: {
      type: Number,
      required: false,
      default: 1
    },
    ruleCnt: {
      type: Number,
      required: false,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<RoomInfo & mongoose.Document>('Room', RoomSchema);
