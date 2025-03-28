import { EmployeeDepartment, UserRole } from '@shared/constants';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { OmitType, PartialType } from '@nestjs/swagger';

class EmployeeDetailsSchema {
  @IsNotEmpty()
  @IsEnum(EmployeeDepartment)
  department: EmployeeDepartment;
}

export class CreateUserSchema {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsObject()
  @ValidateIf((o) => !o.role || o.role === UserRole.Employee)
  @ValidateNested()
  @Type(() => EmployeeDetailsSchema)
  details?: EmployeeDetails;
}

export class UpdateUserSchema extends PartialType(OmitType(CreateUserSchema, ['username'])) {}
