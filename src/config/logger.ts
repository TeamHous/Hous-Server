import winston from 'winston';
// import winstonDaily from 'winston-daily-rotate-file'; // 로그 파일을 일별로 local에 저장할 때 사용

// const logDir = 'logs'; // logs 디렉토리 하위에 로그 파일 저장
const { combine, timestamp, printf, colorize } = winston.format;

// log 포맷 정의
const logFormat = printf(info => {
  return `${info.timestamp} [${info.level}]: ${info.message}`;
});

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  level: 'silly',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    logFormat
  )
  //   transports: [
  //     // info 레벨 로그를 저장할 파일 설정
  //     new winstonDaily({
  //       level: 'info',
  //       datePattern: 'YYYY-MM-DD',
  //       dirname: logDir,
  //       filename: `%DATE%.log`,
  //       maxFiles: 30, // 30일치 로그 파일 저장
  //       zippedArchive: true
  //     }),
  //     // error 레벨 로그를 저장할 파일 설정
  //     new winstonDaily({
  //       level: 'error',
  //       datePattern: 'YYYY-MM-DD',
  //       dirname: logDir + '/error', // error.log 파일은 /logs/error 하위에 저장
  //       filename: `%DATE%_error.log`,
  //       maxFiles: 30,
  //       zippedArchive: true
  //     })
  //   ]
});

// morgan 라이브러리를 이용하여 http 요청에 대한 log도 우리가 정의한 log 형태로 처리하기 위함
const stream = {
  write: (message: string) => {
    logger.info(message);
  }
};

// development 환경인 경우,
if (process.env.NODE_ENV === 'development') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(colorize({ all: true }), logFormat) //색깔 표시 및 정의한 로그 포맷 형태로
    })
  );
}

export { logger, stream };
