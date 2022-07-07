import message from '../modules/responseMessage';

type statusMessage = {
  [key: number]: string;
};

const DEFAULT_HTTP_STATUS_MESSAGES: statusMessage = {
  400: message.BAD_REQUEST,
  401: message.UNAUTHORIZED,
  403: message.FORBIDDEN,
  404: message.NOT_FOUND,
  409: message.DUPLICATED,
  500: message.INTERNAL_SERVER_ERROR,
  503: message.TEMPORARY_UNAVAILABLE,
  600: message.DB_ERROR
};

//interface 이용해 Error 객체에 statusCode key 추가
export interface ErrorWithStatusCode extends Error {
  statusCode?: number;
}

const errorGenerator = ({ msg = message.INTERNAL_SERVER_ERROR, statusCode = 500 }: { msg?: string; statusCode: number }): void => {
  //인자로 들어오는 메세지와 상태 코드를 매핑
  const err: ErrorWithStatusCode = new Error(msg || DEFAULT_HTTP_STATUS_MESSAGES[statusCode]);
  err.statusCode = statusCode;
  throw err;
};

export default errorGenerator;
