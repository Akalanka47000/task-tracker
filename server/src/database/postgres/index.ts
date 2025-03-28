import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { type SeederOptions } from 'typeorm-extension';
import { default as Config } from '@/config';
import { User } from '../../modules/users/models';

export * from './repository';

const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  url: Config.DB_URL,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [User],
  migrations: process.env.TYPEORM_CLI ? ['./src/database/postgres/migrations/**.ts'] : [],
  migrationsRun: false,
  seeds: ['./src/database/postgres/seeds/*.ts']
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
