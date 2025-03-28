import 'reflect-metadata';
import { User } from '../../modules/users/models';
import { default as Config } from '@/config';
import { DataSource } from 'typeorm';

export * from './repository';

const dataSource = new DataSource({
  type: 'postgres',
  url: Config.DB_URL,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [User],
  migrations: ['./src/database/postgres/migrations/*.ts']
});

export default dataSource;
