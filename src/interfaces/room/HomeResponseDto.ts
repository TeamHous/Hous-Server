export interface HomeResponseDto {
  eventList: EventsInfo[];
  keyRulesList: string[];
  todoList: TodoInfo[];
  homieProfileList: HomieProfile[];
  roomCode: string;
}

export interface EventsInfo {
  eventId: string;
  dDay: string;
  eventName: string;
  eventIcon: string;
}

export interface TodoInfo {
  isCheck: boolean;
  todo: string;
}

export interface HomieProfile {
  homieId: string;
  userName: string;
  typeName: string;
  typeColor: string;
}
