import { traced } from '@sliit-foss/functions';
import { redis } from '@/database/redis';
import { Injectable } from '@nestjs/common';
import { IntelligenceRepository } from '../../repository';
import { GetPaginatedSummarySchema, GetSummarySchema } from './schema';

const layer = 'repository';

@Injectable()
export class IntelligenceService {
  constructor(private repository: IntelligenceRepository) {}

  async getSystemSummary({ filter }: GetSummarySchema = {}): Promise<ISystemaInsights> {
    const summaryItems = await traced[layer](preserveContext(this.repository, 'getSystemSummaryByDepartment'))(
      filter?.department
    );
    return {
      total_employees: summaryItems[0],
      total_tasks: summaryItems[1],
      completed_tasks: summaryItems[2],
      overdue_tasks: summaryItems[3]
    };
  }

  async getEmployeeSummary(retrievalOptions: GetPaginatedSummarySchema): Promise<PaginatedResult<IEmployeeInsight>> {
    const result = await redis.preserveJSON(
      `intelligence-employee-summary-${JSON.stringify(retrievalOptions)}`,
      () => traced[layer](preserveContext(this.repository, 'getEmployeeSummaryByDepartment'))(retrievalOptions),
      10
    );
    return result;
  }
}
