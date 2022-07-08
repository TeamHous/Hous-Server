import mongoose from 'mongoose';
import { RoomInfo } from './RoomInfo';

export interface RoomResponseDto extends RoomInfo {
  _id: mongoose.Types.ObjectId;
}
