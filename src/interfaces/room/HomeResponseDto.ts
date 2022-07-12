import { EventResponseDto } from '../event/EventResponseDto';

export interface HomeResponseDto {
  eventList: EventsInfo[];
  keyRulesList: string[];
  todoList: TodoInfo[];
  homieProfileList: HomieProfile[];
  roomCode: string;
}

export interface EventsInfo extends EventResponseDto {
  dDay: string;
}

export interface TodoInfo {
  isCheck: boolean;
  todo: string;
  createdAt: string;
}

export interface HomieProfile {
  _id: string;
  userName: string;
  typeName: string;
  typeColor: string;
}
