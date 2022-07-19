import mongoose from 'mongoose';

export interface UserProfileResponseDto extends UserBaseResponseDto, TypeDto {
  typeId: mongoose.Types.ObjectId;
  notificationState: boolean;
}

export interface UserBaseResponseDto {
  userName: string;
  job: string;
  introduction: string;
  hashTag: string[];
}

export interface TypeDto {
  typeName: string;
  typeColor: string;
  typeScore?: number[];
}
