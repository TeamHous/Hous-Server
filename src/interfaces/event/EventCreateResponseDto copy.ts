import { PostBaseResponseDto } from '../common/PostBaseResponseDto';
import { EventUpdateDto } from './EventUpdateDto';

export interface EventUpdateResponseDto
  extends PostBaseResponseDto,
    EventUpdateDto {}
