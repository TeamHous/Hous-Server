import mongoose from 'mongoose';
import { RoomInfo } from '../interfaces/room/RoomInfo';

const RoomSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      required: true,
      unique: true
    },
    ruleCategoriesId: [
      {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'RuleCategory'
      }
    ],
    rulesId: [
      {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'Rule'
      }
    ],
    usersId: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
      }
    ],
    eventsId: [
      {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'Event'
      }
    ],
    checksId: [
      {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'Check'
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model<RoomInfo & mongoose.Document>('Room', RoomSchema);
