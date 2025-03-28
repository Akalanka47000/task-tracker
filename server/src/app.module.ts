import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { default as dataSource } from './database/postgres';
import { SystemModule } from './modules/system/index.module';
import { UserModule } from './modules/users/index.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSource.options), SystemModule, UserModule]
})
export class AppModule {}
