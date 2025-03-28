import { Response } from 'express';
import { moduleLogger } from '@sliit-foss/module-logger';
import { upperFirst } from 'lodash';
import { QueryFailedError } from 'typeorm';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

const codes = {
  23505: 400,
  23502: 500,
  23503: 400
};

const logger = moduleLogger('Global-error-interceptor');

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    exception.status ??= 500;

    if (exception instanceof QueryFailedError) {
      exception = exception as any;
      exception.status = codes[exception.code] ?? exception.status;
      if (exception.code === '23505') {
        const match = exception.detail.match(/Key \(([^)]+)\)=\((.*?)\) already exists\./);
        if (match) {
          const [, field, value] = match;
          exception.message = `${upperFirst(field)} (${value}) already exists.`;
        } else {
          exception.message = exception.detail ?? exception.message;
        }
      } else {
        exception.message = exception.detail ?? exception.message;
      }
    } else {
      exception.message = Array.isArray(exception.response?.message)
        ? (exception.response?.message?.[0] ?? exception.message)
        : exception.message;
    }

    logger.error(`${exception.name} - message: ${exception.message} - stack: ${exception.stack}`);

    response.status(exception.status).json({
      message:
        exception.message && exception.status < 500
          ? upperFirst(exception.message)
          : "Just patching things up. This'll be over in a jiffy."
    });
  }
}
