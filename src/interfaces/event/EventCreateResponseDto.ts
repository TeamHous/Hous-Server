import { PostBaseResponseDto } from '../common/PostBaseResponseDto';
import { EventCreateDto } from './EventCreateDto';

export interface EventCreateResponseDto
  extends EventCreateDto,
    PostBaseResponseDto {}
