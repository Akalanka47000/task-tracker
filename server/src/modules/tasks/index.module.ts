import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../users/index.module';
import { TaskController as ControllerV1 } from './api/v1/controller';
import { TaskService as ServiceV1 } from './api/v1/service';
import { Task } from './models';
import { TaskRepository } from './repository';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), UserModule],
  controllers: [ControllerV1],
  providers: [ServiceV1, TaskRepository],
  exports: [TypeOrmModule, ServiceV1, TaskRepository]
})
export class TaskModule {}
