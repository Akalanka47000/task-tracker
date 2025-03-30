import { default as crypto } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { default as context } from 'express-http-context';
import { ctxCorrelationId, headers } from '@shared/constants';
import { moduleLogger } from '@sliit-foss/module-logger';
import { default as compression } from 'compression';
import { default as cookieParser } from 'cookie-parser';
import { default as helmet } from 'helmet';
import { default as qs } from 'qs';
import { Config } from '@/config';
import { GlobalExceptionFilter, httpLogger, responseInterceptor } from '@/middleware';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export const service = 'Task Tracker Service';

const logger = moduleLogger(service);

export async function createApplication() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: Config.FRONTEND_BASE_URL,
      credentials: true
    }
  });

  app.setGlobalPrefix('api', { exclude: ['system/*'] });

  app.enableVersioning({ type: VersioningType.URI });

  app.use(helmet());

  app.use(compression());

  app.use(cookieParser());

  app.use(context.middleware);

  app.use((req: Request, _res: Response, next: NextFunction) => {
    context.set(ctxCorrelationId, req.headers[headers.correlationId] ?? crypto.randomBytes(16).toString('hex'));
    next();
  });

  app.use(httpLogger);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true
    })
  );

  app.use((req: Request, _: Response, next: NextFunction) => {
    Object.defineProperty(req, 'query', {
      value: qs.parse(req.query as any),
      enumerable: true
    });
    next();
  });

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.use(responseInterceptor);

  return app;
}

async function bootstrap() {
  const app = await createApplication();
  await app.listen(Config.PORT, Config.HOST, () => {
    logger.info(`server listening on ${Config.HOST}:${Config.PORT}`);
  });
}

bootstrap();
