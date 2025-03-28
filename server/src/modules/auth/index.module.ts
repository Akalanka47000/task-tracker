import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/models';
import { UserRepository } from '../users/repository';
import { AuthController as ControllerV1 } from './api/v1/controller';
import { AuthService as ServiceV1 } from './api/v1/service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [ControllerV1],
  providers: [ServiceV1, UserRepository],
  exports: [TypeOrmModule]
})
export class AuthModule {}
