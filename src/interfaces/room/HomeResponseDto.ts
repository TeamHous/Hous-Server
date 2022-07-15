import { PostBaseResponseDto } from '../common/PostBaseResponseDto';

export interface HomeResponseDto {
  eventList: EventsResponseDto[];
  keyRulesList: string[];
  todoList: TodoResponseDto[];
  homieProfileList: HomieProfileResponseDto[];
  roomCode: string;
}

export interface EventsResponseDto extends PostBaseResponseDto {
  eventIcon: string;
  dDay: string;
}

export interface TodoResponseDto {
  isChecked: boolean;
  ruleName: string;
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
