import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import config from './config';
import { logger, stream } from './config/logger';
import generalErrorHandler from './errors/generalErrorHandler';
import connectDB from './loaders/db';
import message from './modules/responseMessage';
import util from './modules/util';
import routes from './routes';
const app = express();
require('dotenv').config();

connectDB();

let morganFormat: string;
if (process.env.NODE_ENV !== 'development') {
  morganFormat = 'combined'; // Apache 표준
} else {
  morganFormat = 'dev';
}
app.use(morgan(morganFormat, { stream: stream })); // logger 설정 추가

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes); // 라우터
app.use(generalErrorHandler);
app.use(function (req: Request, res: Response, next: NextFunction) {
  // 잘못된 경로에 대한 예외처리
  res.status(404).json(util.fail(404, message.BAD_PATH));
});

// 그 외 모든 error
interface ErrorType {
  message: string;
  status: number;
}

app.use(function (
  err: ErrorType,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'production' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app
  .listen(config.port, () => {
    logger.info(`
    ########################################################
          🛡️ [${process.env.NODE_ENV}] Server listening on port 🛡️
    ######################################################## 
  `);
  })
  .on('error', err => {
    logger.error(err);
    process.exit(1);
  });
