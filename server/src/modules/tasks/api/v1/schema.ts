import { Priority } from '@shared/constants';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger';

export class CreateTaskSchema {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(Priority)
  @IsNotEmpty()
  priority: Priority;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  due_date: Date;

  @IsUUID()
  @IsNotEmpty()
  employee_id: string;
}

export class UpdateTaskStatusSchema {
  @IsOptional()
  @IsBoolean()
  completed: boolean;
}

export class UpdateTaskSchema extends IntersectionType(
  PartialType(OmitType(CreateTaskSchema, ['employee_id'])),
  UpdateTaskStatusSchema
) {}
