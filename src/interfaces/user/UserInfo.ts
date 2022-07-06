import mongoose from 'mongoose';

export interface UserInfo {
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
  typeId: mongoose.Types.ObjectId;
  typeScore: number[];
  roomId: mongoose.Types.ObjectId;
}
