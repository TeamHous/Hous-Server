import { PostBaseResponseDto } from '../common/PostBaseResponseDto';
import { EventCreateDto } from './EventCreateDto';

export interface EventUpdateResponseDto
  extends PostBaseResponseDto,
    EventCreateDto {}
