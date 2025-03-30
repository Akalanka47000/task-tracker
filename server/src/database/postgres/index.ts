import { default as Config, Enviroment } from '@/config';
import { Task } from '@/modules/tasks/models';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { type SeederOptions } from 'typeorm-extension';
import { User } from '../../modules/users/models';

export * from './repository';

const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  url: Config.DB_URL,
  synchronize: false,
  logging: Config.ENVIRONMENT !== Enviroment.Production,
  entities: [Task, User],
  migrations:
    process.env.TYPEORM_CLI || process.env.NODE_ENV === 'test' ? ['./src/database/postgres/migrations/**.ts'] : [],
  migrationsRun: false,
  seeds: ['./src/database/postgres/seeds/*.ts']
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
