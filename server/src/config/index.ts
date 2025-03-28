import 'dotenv/config';
import { moduleLogger } from '@sliit-foss/module-logger';

const logger = moduleLogger('Config');

export enum Enviroment {
  Production = 'Production',
  Development = 'Development',
  Local = 'Local'
}

export const Config = {
  HOST: process.env.HOST ?? '0.0.0.0',
  PORT: Number(process.env.SERVICE_PORT ?? process.env.PORT ?? 8080),
  DB_URL: process.env.DB_URL,
  REDIS_CONNECTION_STRING: process.env.REDIS_CONNECTION_STRING,
  JWT_SECRET: process.env.JWT_SECRET ?? 'secret',
  SALT_ROUNDS: Number(process.env.SALT_ROUNDS || 10),
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY ?? '1h',
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY ?? '1d',
  FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL ?? 'http://localhost:5173',
  SERVICE_REQUEST_KEY: process.env.SERVICE_REQUEST_KEY,
  HEALTH_CHECK_ACCESS_TOKEN: process.env.HEALTH_CHECK_ACCESS_TOKEN,
  ENVIRONMENT: process.env.ENVIRONMENT ?? Enviroment.Local
};

const requiredKeys = ['DB_URL', 'REDIS_CONNECTION_STRING'];

requiredKeys.forEach((k) => {
  if (!Config[k]) {
    logger.error(`Missing required environment variable: ${k}`);
    process.exit(1);
  }
});

export default Config;
