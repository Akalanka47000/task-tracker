import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional, ValidateIf, IsObject, ValidateNested } from 'class-validator';
import { EmployeeDepartment, UserRole } from '@shared/constants';
import { Type } from 'class-transformer';

class EmployeeDetailsSchema {
  @IsNotEmpty()
  @IsEnum(EmployeeDepartment)
  department: EmployeeDepartment;
}

export class CreateUserSchema {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsObject()
  @ValidateIf((o) => o.role === UserRole.Employee)
  @ValidateNested()
  @Type(() => EmployeeDetailsSchema)
  details?: EmployeeDetails;
}

export class UpdateUserSchema extends PartialType(CreateUserSchema) {}