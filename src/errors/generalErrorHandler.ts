import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger';
import messages from '../modules/responseMessage';
import util from '../modules/util';
import { ErrorWithStatusCode } from './errorGenerator';

const generalErrorHandler: ErrorRequestHandler = (
  err: ErrorWithStatusCode,
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  const { message, statusCode } = err;
  logger.error(err.stack); //에러 스택까지 보여줌 (개발 단계에선 보기 편하니까!)
  // logger.error(`[statusCode: ${err.statusCode}] message: ${err.message}`); // 릴리즈를 한다면? 이런 형태가 좋을 듯
  // 인자로 statusCode를 넘기지 않는 경우, 500 에러를 보냄
  if (!statusCode || statusCode == 500)
    return res.status(500).send(util.fail(500, messages.INTERNAL_SERVER_ERROR));
  else return res.status(statusCode).send(util.fail(statusCode, message));
};

export default generalErrorHandler;
