import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController as ControllerV1 } from './api/v1/controller';
import { UserService as ServiceV1 } from './api/v1/service';
import { User } from './models';
import { UserRepository } from './repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [ControllerV1],
  providers: [ServiceV1, UserRepository],
  exports: [TypeOrmModule]
})
export class UserModule {}
