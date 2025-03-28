import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsUUID } from 'class-validator';
import { FindOptionsWhere, OrderByCondition } from 'typeorm';

export class UUIDSchema {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class QuerySchema<T> {
  @IsOptional()
  @IsObject()
  filter?: FindOptionsWhere<T>;

  @IsOptional()
  @IsObject()
  sort?: OrderByCondition;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  page: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}
