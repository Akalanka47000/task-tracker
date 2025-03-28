import { FindOptionsWhere, OrderByCondition } from 'typeorm';
import { IsOptional, IsNotEmpty, IsObject, IsNumber, IsString } from 'class-validator';

export class UUIDSchema {
    @IsNotEmpty()
    @IsString()
    id: string;
}

export class QuerySchema<T> {
    @IsOptional()
    @IsObject()
    filter?: FindOptionsWhere<T>;

    @IsOptional()
    @IsObject()
    sort?: OrderByCondition;

    @IsOptional()
    @IsNumber()
    page?: number;

    @IsOptional()
    @IsNumber()
    limit?: number;
}