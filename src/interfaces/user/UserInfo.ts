import mongoose from 'mongoose';

export interface UserInfo {
  roomId: mongoose.Types.ObjectId;
  typeId: mongoose.Types.ObjectId;
  email: string;
  password: string;
  userName: string;
  gender: string;
  birthday: Date;
  job: string;
  introduction: string;
  hashTag: string[];
  fcmToken: string;
  notificationState: boolean;
  typeScore: number[];
}
