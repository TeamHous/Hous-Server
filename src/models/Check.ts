import mongoose from 'mongoose';
import { CheckInfo } from '../interfaces/check/CheckInfo';

const CheckSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Room'
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    ruleId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Rule'
    },
    date: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<CheckInfo & mongoose.Document>(
  'Check',
  CheckSchema
);
