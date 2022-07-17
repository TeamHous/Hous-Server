import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import config from '../config/index';
import { logger } from '../config/logger';
import slackAlarm, { SlackMessageFormat } from '../middleware/slackAlarm';
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

  // 인자로 statusCode를 넘기지 않는 경우, 500 에러를 보냄
  if (!statusCode || statusCode == 500) {
    // 프로덕트 환경일 때, 500 에러 발생 시 슬랙 알림 울리도록 추가
    if (config.env === 'production') {
      const message: SlackMessageFormat = {
        color: slackAlarm.colors.danger,
        title: 'Hous 서버 에러',
        text: err.message,
        fields: [
          {
            title: 'Error Stack:',
            value: `\`\`\`${err.stack}\`\`\``
          }
        ]
      };
      slackAlarm.sendMessage(message);
      logger.error(`[statusCode: ${err.statusCode}] message: ${err.message}`);
    }
    return res.status(500).send(util.fail(500, messages.INTERNAL_SERVER_ERROR));
  } else {
    return res.status(statusCode).send(util.fail(statusCode, message));
  }
};

export default generalErrorHandler;
