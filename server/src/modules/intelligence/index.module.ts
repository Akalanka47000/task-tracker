import { Module } from '@nestjs/common';
import { TaskModule } from '../tasks/index.module';
import { UserModule } from '../users/index.module';
import { IntelligenceController as ControllerV1 } from './api/v1/controller';
import { IntelligenceService as ServiceV1 } from './api/v1/service';
import { IntelligenceRepository } from './repository';

@Module({
  imports: [TaskModule, UserModule],
  controllers: [ControllerV1],
  providers: [ServiceV1, IntelligenceRepository],
  exports: []
})
export class IntelligenceModule {}
