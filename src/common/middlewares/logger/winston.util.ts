import { utilities, WinstonModule } from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as winston from 'winston';
import * as process from 'process';

// @copy from
// https://velog.io/@aryang/NestJS-winston%EC%9C%BC%EB%A1%9C-%EB%A1%9C%EA%B7%B8-%EA%B4%80%EB%A6%AC

const env = process.env.NODE_ENV;
const logDir = process.env.LOG_DIR || '/var/log/api-server'; // log 파일을 관리할 폴더
const dailyOptions = (level: string) => {
  return {
    level,
    frequency: '24h', // 매일매일 로그 파일 생성
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + `/${level}`,
    filename: `%DATE%.${level}.log`,
    maxFiles: 30, //30일치 로그파일 저장
    zippedArchive: true, // 로그가 쌓이면 압축하여 관리
    timestamp: true,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
  };
};

// rfc5424를 따르는 winston만의 log level
// error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
export const winstonLogger = WinstonModule.createLogger({
  transports: [
    // console log
    new winston.transports.Console({
      level: env === 'production' ? 'http' : 'silly',
      // production 환경이라면 http, 개발환경이라면 모든 단계를 로그
      format:
        env === 'production'
          ? // production 환경은 자원을 아끼기 위해 simple 포맷 사용
            winston.format.simple()
          : winston.format.combine(
              winston.format.timestamp(),
              utilities.format.nestLike('Manito42', {
                prettyPrint: true, // nest에서 제공하는 옵션. 로그 가독성을 높여줌
                colors: true,
              }),
            ),
    }),
    // file log
    new winstonDaily(dailyOptions('info')),
    new winstonDaily(dailyOptions('warn')),
    new winstonDaily(dailyOptions('error')),
  ],
});
