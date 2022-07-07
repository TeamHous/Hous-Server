import mongoose from 'mongoose';
import { EventInfo } from '../interfaces/event/EventInfo';

const EventSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Room'
    },
    participantsId: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
      }
    ],
    eventName: {
      type: String,
      required: true
    },
    eventIcon: {
      type: String,
      required: true
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

export default mongoose.model<EventInfo & mongoose.Document>(
  'Event',
  EventSchema
);
