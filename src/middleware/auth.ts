import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import errorGenerator from '../errors/errorGenerator';
import message from '../modules/responseMessage';

export default (req: Request, res: Response, next: NextFunction) => {
  // request-header 에서 토큰 받아오기
  const token = req.headers['authorization']?.split(' ').reverse()[0];

  // 토큰 유뮤 검증
  if (!token) {
    throw errorGenerator({ msg: message.NULL_VALUE_TOKEN, statusCode: 401 });
  }

  // 토큰 검증
  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    req.body.user = (decoded as any).user;

    next();
  } catch (error: any) {
    console.log(error);
    if (error.name === 'TokenExpiredError') {
      throw errorGenerator({ msg: message.INVALID_TOKEN, statusCode: 401 });
    }
    throw errorGenerator({ statusCode: 500 });
  }
};
