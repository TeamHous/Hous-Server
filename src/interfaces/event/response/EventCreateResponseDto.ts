import { PostBaseResponseDto } from '../../common/response/PostBaseResponseDto';
import { EventCreateDto } from '../request/EventCreateDto';

export interface EventCreateResponseDto
  extends EventCreateDto,
    PostBaseResponseDto {}
