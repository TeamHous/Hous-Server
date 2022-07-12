import mongoose from 'mongoose';
import { UserInfo } from '../interfaces/user/UserInfo';

const UserSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: 'Room'
    },
    typeId: {
      type: mongoose.Types.ObjectId,
      required: false,
      default: '62c86a178d1d1f31b5b3cb3e',
      ref: 'Type'
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: true
    },
    birthday: {
      type: Date,
      required: false,
      default: new Date()
    },
    job: {
      type: String,
      required: false,
      default: ''
    },
    introduction: {
      type: String,
      required: false,
      default: ''
    },
    hashTag: [
      {
        type: String,
        required: false
      }
    ],
    fcmToken: {
      type: String,
      required: true
    },
    notificationState: {
      type: Boolean,
      required: false,
      default: true
    },

    typeScore: [
      {
        type: Number,
        required: false
      }
    ],
    typeUpdatedDate: {
      type: Date,
      required: false,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<UserInfo & mongoose.Document>('User', UserSchema);
