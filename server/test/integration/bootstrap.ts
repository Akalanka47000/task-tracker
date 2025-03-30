import 'tsconfig-paths/register';
import { default as exec } from '@sliit-foss/actions-exec-wrapper';
import { runDockerContainer } from '../__utils__';

process.env.DISABLE_FUNCTION_TRACING = 'true';

export const getInitializedApp = async () => {
  const { createApplication } = require('@/main');

  const app = await createApplication();

  await app.init();

  await exec('npm run migrate');

  await exec('npm run seed');

  return app;
};

export default async () => {
  await Promise.all([
    runDockerContainer('redis', 6379),
    runDockerContainer(
      'postgres',
      5432,
      `-e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=task-tracker`
    )
  ]);
};
