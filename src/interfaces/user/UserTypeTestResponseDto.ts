import { PostBaseResponseDto } from '../common/PostBaseResponseDto';
import { UserTypeTestDto } from './UserTypeTestDto';

export interface UserTypeTestResponseDto
  extends UserTypeTestDto,
    PostBaseResponseDto {}
