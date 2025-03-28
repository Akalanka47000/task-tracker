import { Config } from "@/config";
import { Controller, Get, NotFoundException, Query } from "@nestjs/common";
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from "@nestjs/terminus";

@Controller('system')
export class SystemController {
    constructor(
        private health: HealthCheckService,
        private db: TypeOrmHealthIndicator,
    ) { }
    @Get('health')
    @HealthCheck()
    check(@Query() query: Record<string, any>) {
        if (Config.HEALTH_CHECK_ACCESS_TOKEN) {
            if (query.token !== Config.HEALTH_CHECK_ACCESS_TOKEN) {
                throw new NotFoundException();
            }
        }
        return this.health.check([
            () => this.db.pingCheck('database'),
        ]);
    }
}