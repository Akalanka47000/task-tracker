import { AdminProtect, FormattedResponse, Protect } from '@/middleware';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetPaginatedSummarySchema, GetSummarySchema } from './schema';
import { IntelligenceService } from './service';

@ApiTags('Intelligence')
@Controller({ path: 'intelligence', version: '1' })
@UseGuards(Protect, AdminProtect)
export class IntelligenceController {
  constructor(private readonly service: IntelligenceService) {}

  @Get('summary')
  async getSystemSummary(@Query() query: GetSummarySchema) {
    const result = await this.service.getSystemSummary(query);
    return FormattedResponse.send({
      message: 'System insights retrieved successfully!',
      data: result
    });
  }

  @Get('employees')
  async getEmployeeSummary(@Query() query: GetPaginatedSummarySchema) {
    const result = await this.service.getEmployeeSummary(query);
    return FormattedResponse.send({
      message: 'Employee insights retrieved successfully!',
      data: result
    });
  }
}
