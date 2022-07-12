import { PostBaseResponseDto } from '../common/PostBaseResponseDto';
import { EventCreateDto } from './EventCreateDto';

export interface EventResponseDto extends PostBaseResponseDto, EventCreateDto {}
