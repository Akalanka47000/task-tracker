import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { default as dataSource } from './database/postgres';
import { RateLimiter, Sentinel } from './middleware';
import { AuthModule } from './modules/auth/index.module';
import { SystemModule } from './modules/system/index.module';
import { TaskModule } from './modules/tasks/index.module';
import { UserModule } from './modules/users/index.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSource.options), AuthModule, SystemModule, TaskModule, UserModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimiter)
      .exclude('/system/health')
      .forRoutes({ path: '*', method: RequestMethod.ALL })
      .apply(Sentinel)
      .exclude('/:version/auth/login', '/system/health')
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
