import { PostBaseResponseDto } from '../../common/response/PostBaseResponseDto';
import { EventUpdateDto } from '../request/EventUpdateDto';

export interface EventUpdateResponseDto
  extends EventUpdateDto,
    PostBaseResponseDto {}
