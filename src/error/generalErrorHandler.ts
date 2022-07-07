import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import messages from '../modules/responseMessage';
import util from '../modules/util';
import { ErrorWithStatusCode } from './errorGenerator';

const generalErrorHandler: ErrorRequestHandler = (err: ErrorWithStatusCode, req: Request, res: Response, next: NextFunction) => {
  const { message, statusCode } = err;
  //인자로 statusCode를 넘기지 않는 경우, 500 에러를 보냄
  res.status(statusCode || 500).send(util.fail(statusCode || 500, message || messages.INTERNAL_SERVER_ERROR));
};

export default generalErrorHandler;
