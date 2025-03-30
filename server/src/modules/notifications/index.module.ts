import { Module } from '@nestjs/common';
import { UserModule } from '../users/index.module';
import { NotificationController as ControllerV1 } from './api/v1/controller';
import { NotificationService as ServiceV1 } from './api/v1/service';

@Module({
  imports: [UserModule],
  controllers: [ControllerV1],
  providers: [ServiceV1],
  exports: [ServiceV1]
})
export class NotificationModule {}
