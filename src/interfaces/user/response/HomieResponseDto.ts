import mongoose from 'mongoose';
import { TypeDto, UserBaseResponseDto } from './UserProfileResponseDto';

export interface HomieResponseDto extends UserBaseResponseDto, TypeDto {
  typeId: mongoose.Types.ObjectId;
}
