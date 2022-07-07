const message = {
  //default error status messages
  BAD_REQUEST: '잘못된 요청',
  BAD_PATH: '잘못된 경로',
  UNAUTHORIZED: '승인되지 않은 유저',
  FORBIDDEN: '권한이 없는 유저의 요청',
  NOT_FOUND: '존재하지 않는 자원',
  DUPLICATED: '이미 존재하는 데이터',
  TEMPORARY_UNAVAILABLE: '일시적으로 사용할 수 없는 서버',
  INTERNAL_SERVER_ERROR: '서버 내부 오류',
  DB_ERROR: '데이터베이스 오류',

  //etc
  NULL_VALUE: '필요한 값이 없습니다.',
  NULL_VALUE_TOKEN: '토큰이 없습니다.',
  INVALID_TOKEN: '만료된 토큰 입니다.',
  INVALID_PASSWORD: '잘못된 비밀번호 입니다.',

  // 유저
  READ_USER_SUCCESS: '유저 조회 성공',
  CREATE_USER_SUCCESS: '유저 생성 성공',
  DELETE_USER_SUCCESS: '유저 삭제 성공',
  UPDATE_USER_SUCCESS: '유저 수정 성공',
  SIGNIN_USER_SUCCESS: '유저 로그인 성공'
};

export default message;
