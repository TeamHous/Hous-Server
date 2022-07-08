import mongoose from 'mongoose';
import { RoomInfo } from '../interfaces/room/RoomInfo';

const RoomSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
      required: true
    },
    roomCode: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<RoomInfo & mongoose.Document>('Room', RoomSchema);
