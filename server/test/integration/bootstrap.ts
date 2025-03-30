import 'tsconfig-paths/register';
import * as dotenv from 'dotenv';
import { App } from 'supertest/types';
import { runSeeders } from 'typeorm-extension';
import { AppModule } from '@/app.module';
import { default as dataSource } from '@/database/postgres';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { runDockerContainer } from '../__utils__';

dotenv.config({ path: '.env.test' });

process.env.DISABLE_FUNCTION_TRACING = 'true';

let _app: INestApplication<App>;

export const app = () => _app.getHttpServer();

export default async () => {
  await Promise.all([
    runDockerContainer('redis', 6379),
    runDockerContainer(
      'postgres',
      5473,
      `-e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=task-tracker`
    )
  ]);

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule]
  }).compile();

  _app = moduleFixture.createNestApplication();

  await _app.init();

  await dataSource.initialize();

  runSeeders(dataSource, {
    seeds: ['src/database/postgres/seeds/**{.ts,.js}']
  });
};
