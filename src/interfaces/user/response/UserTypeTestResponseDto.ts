import { PostBaseResponseDto } from '../../common/response/PostBaseResponseDto';
import { UserTypeTestDto } from '../request/UserTypeTestDto';

export interface UserTypeTestResponseDto
  extends UserTypeTestDto,
    PostBaseResponseDto {}
