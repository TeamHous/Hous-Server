const message = {
  // default error status messages
  BAD_REQUEST: '잘못된 요청입니다.',
  BAD_PATH: '잘못된 경로입니다.',
  UNAUTHORIZED: '승인되지 않은 유저입니다.',
  FORBIDDEN: '권한이 없는 유저의 요청입니다.',
  NOT_FOUND: '존재하지 않는 자원입니다.',
  DUPLICATED: '이미 존재하는 데이터입니다.',
  TEMPORARY_UNAVAILABLE: '일시적으로 사용할 수 없는 서버입니다.',
  INTERNAL_SERVER_ERROR: '서버 내부 오류입니다.',
  DB_ERROR: '데이터베이스 오류입니다.',

  // etc
  NULL_VALUE: '필요한 값이 없습니다.',
  NULL_VALUE_TOKEN: '토큰이 없습니다.',
  INVALID_TOKEN: '만료된 토큰 입니다.',
  INVALID_PASSWORD: '잘못된 비밀번호 입니다.',
  INVALID_ID: '유효하지 않은 id입니다.',
  EXCEED_CNT: '제한 개수를 초과하였습니다.',
  EXCEED_LENGTH: '제한 길이를 초과하였습니다.',
  INVALID_ICON: '잘못된 아이콘 값입니다.',
  INVALID_DAY: '잘못된 요일 값입니다.',

  NOT_FOUND_USER_EMAIL: '가입되지 않은 이메일입니다.',
  CONFLICT_EMAIL: '이메일 중복입니다.',

  SIGNUP_SUCCESS: '회원가입 성공입니다.',
  LOGIN_SUCCESS: '로그인 성공입니다.',

  // 방
  NOT_FOUND_ROOM: '존재하지 않는 방입니다.',
  CONFLICT_JOINED_ROOM: '참가중인 방이 있습니다.',

  READ_ROOM_SUCCESS: '방 조회 성공입니다.',
  CREATE_ROOM_SUCCESS: '방 생성 성공입니다.',
  JOIN_ROOM_SUCCESS: '방 참가 성공입니다.',

  // 규칙
  NOT_FOUND_RULE: '존재하지 않는 규칙입니다.',
  FORBIDDEN_GET_RULE: '참가하고 있지 않은 방의 규칙을 조회할 수 없습니다.',
  NOT_FOUND_RULE_CATEGORY: '존재하지 않는 규칙 카테고리입니다.',
  CONFLICT_RULE_CATEGORY: '이미 존재하는 규칙 카테고리명입니다.',

  READ_RULE_SUCCESS: '규칙 조회 성공입니다.',
  CREATE_RULE_SUCCESS: '규칙 생성 성공입니다.',
  CREATE_RULE_CATEGORY_SUCCESS: '규칙 카테고리 생성 성공입니다.',
  UPDATE_RULE_CATEGORY_SUCCESS: '규칙 카테고리 수정 성공입니다.',

  // 사용자
  READ_USER_SUCCESS: '사용자 정보 조회 성공입니다.',
  UPDATE_USER_SUCCESS: '사용자 정보 수정 성공입니다.',
  NOT_FOUND_USER: '조회할 사용자 정보가 없습니다.',
  READ_USER_SETTING_SUCCESS: '사용자 설정 조회 성공입니다.',
  UPDATE_USER_NOTIFICATION_STATE_SUCCESS: '사용자 알림 설정 수정 성공입니다.',

  // 이벤트
  NOT_FOUND_EVENT: '존재하지 않는 이벤트입니다.',
  CREATE_EVENT_SUCCESS: '이벤트 생성 성공입니다.',
  UPDATE_EVENT_SUCCESS: '이벤트 수정 성공입니다.',
  DELETE_EVENT_SUCCESS: '이벤트 삭제 성공입니다.'
};

export default message;
