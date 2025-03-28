import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { SystemController } from './controller';

@Module({
    imports: [
        TerminusModule.forRoot({
            gracefulShutdownTimeoutMs: 30000,
        }),
    ],
    controllers: [SystemController],
})

export class SystemModule { }