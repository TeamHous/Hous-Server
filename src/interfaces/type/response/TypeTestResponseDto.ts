import mongoose from 'mongoose';
import { PostBaseResponseDto } from '../../common/response/PostBaseResponseDto';
import { TypeTestDto } from '../request/TypeTestDto';

export interface TypeTestResponseDto extends TypeTestDto, PostBaseResponseDto {
  typeId: mongoose.Types.ObjectId;
}
