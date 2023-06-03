import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';

// Query 에서 비롯되는 에러들을 핸들링하는 필터입니다.
@Catch()
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  logger = new Logger('PrismaClientExceptionFilter');
  catch(exception, host: ArgumentsHost) {
    this.logger.error(exception.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002': {
          // Unique constraint failed -> already exists
          response.status(409).json({
            statusCode: 409,
            message: 'already exists.',
          });
          break;
        }
        case 'P2003': {
          // Foreign key constraint failed
          response.status(400).json({
            statusCode: 400,
            message: 'property in data is not valid.',
          });
          break;
        }
        case 'P2016': {
          // Query interpretation error -> where id = not exist id
          response.status(400).json({
            statusCode: 400,
            message: 'not exist id property contains',
          });
          break;
        }
        case 'P2025': {
          // "An operation failed because it depends on one or more records that were required but not found. {cause}"
          response.status(400).json({
            statusCode: 400,
            message: 'not exist id property contains',
          });
          break;
        }
        default: {
          // other query fail -> internal server error
          super.catch(exception, host);
        }
      }
    } else if (exception instanceof HttpException) {
      const status = exception.getStatus();
      response.status(status).json({
        statusCode: status,
        message: exception.message,
      });
    } else {
      super.catch(exception, host);
    }
  }
}
