import { EmployeeDepartment } from '@shared/constants';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, ValidateNested } from 'class-validator';

export class GetSummaryFilterSchema {
  @IsEnum(EmployeeDepartment)
  @IsOptional()
  department: EmployeeDepartment;
}

export class GetSummarySchema {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GetSummaryFilterSchema)
  filter?: GetSummaryFilterSchema;
}

export class GetPaginatedSummarySchema extends GetSummarySchema {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  page: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsObject()
  sort?: Record<string, string>;
}
