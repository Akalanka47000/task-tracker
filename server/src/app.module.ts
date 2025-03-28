import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/users/index.module';
import { default as dataSource} from './database/postgres';
import { SystemModule } from './modules/system/index.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSource.options),
    SystemModule,
    UserModule,
  ],
})
export class AppModule {}