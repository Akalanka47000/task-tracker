import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { getFromContainer, MetadataStorage } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { default as compression } from 'compression';
import { default as context } from 'express-http-context';
import { default as helmet } from 'helmet';
import { moduleLogger } from '@sliit-foss/module-logger';
import { default as crypto } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { ctxCorrelationId, headers } from '@shared/constants';
import { default as cookieParser } from 'cookie-parser';
import { Config, Enviroment } from '@/config';
import { httpLogger, rateLimiter, responseInterceptor } from '@/middleware';
import { AppModule } from './app.module';

export const service = 'Task Tracker Service';

const logger = moduleLogger(service);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

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
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // app.useGlobalFilters(new TypeOrmExceptionFilter());

  app.use(responseInterceptor);

  if (Config.ENVIRONMENT !== Enviroment.Production) {
    const swaggerConfig = new DocumentBuilder().setTitle('Task Tracker API').build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);

    const metadata = (getFromContainer(MetadataStorage) as any).validationMetadatas;

    document.components ??= {};

    document.components.schemas = Object.assign(
      {},
      document.components.schemas || {},
      validationMetadatasToSchemas(metadata),
    );

    SwaggerModule.setup('api', app, document);
  }

  await app.listen(Config.PORT, Config.HOST, () => {
    logger.info(`${service} listening on ${Config.HOST}:${Config.PORT}`);
  });
}

bootstrap();