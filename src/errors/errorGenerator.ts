const DEFAULT_HTTP_STATUS_MESSAGES = {
  400: 'Bad Requests',
  401: 'Unauthorized',
  403: 'Foribdden',
  404: 'Not Found',
  409: 'duplicate',
  500: 'Internal Server Error',
  503: 'Temporary Unavailable'
};

//interface 이용해 Error 객체에 statusCode key 추가
export interface ErrorWithStatusCode extends Error {
  statusCode?: number;
}

const errorGenerator = ({ msg = '', statusCode = 500 }: { msg?: string; statusCode: number }): void => {
  //인자로 들어오는 메세지와 상태 코드를 매핑
  const err: ErrorWithStatusCode = new Error(msg || DEFAULT_HTTP_STATUS_MESSAGES[statusCode as keyof typeof DEFAULT_HTTP_STATUS_MESSAGES]);
  err.statusCode = statusCode;
  throw err;
};

export default errorGenerator;
