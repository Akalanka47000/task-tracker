import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { default as dataSource } from './database/postgres';
import { Sentinel } from './middleware';
import { AuthModule } from './modules/auth/index.module';
import { SystemModule } from './modules/system/index.module';
import { UserModule } from './modules/users/index.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSource.options), AuthModule, SystemModule, UserModule],
  providers: [...UserModule.providers()]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(Sentinel)
      .exclude('/:version/auth/login', '/system/health')
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
