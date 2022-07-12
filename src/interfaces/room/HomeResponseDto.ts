export interface HomeResponseDto {
  eventList: EventsInfo[];
  keyRulesList: string[];
  todoList: TodoInfo[];
  homieProfileList: HomieProfile[];
  roomCode: string;
}

export interface EventsInfo {
  _id: string;
  dDay: string;
  eventName: string;
  eventIcon: string;
}

export interface TodoInfo {
  isCheck: boolean;
  todo: string;
  createdAt: Date;
}

export interface HomieProfile {
  _id: string;
  userName: string;
  typeName: string;
  typeColor: string;
}
