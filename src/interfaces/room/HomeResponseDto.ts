import { EventResponseDto } from '../event/EventResponseDto';

export interface HomeResponseDto {
  eventList: EventsResponseDto[];
  keyRulesList: string[];
  todoList: TodoResponseDto[];
  homieProfileList: HomieProfileResponseDto[];
  roomCode: string;
}

export interface EventsResponseDto extends EventResponseDto {
  dDay: string;
}

export interface TodoResponseDto {
  existCheck: boolean;
  todoName: string;
}

export interface TodoWithDate extends TodoResponseDto {
  createdAt: string;
}

export interface HomieProfileResponseDto {
  _id: string;
  userName: string;
  typeName: string;
  typeColor: string;
}
