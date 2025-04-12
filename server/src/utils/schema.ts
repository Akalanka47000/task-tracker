import { IsNotEmpty, IsUUID } from 'class-validator';

export class UUIDSchema {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export interface QuerySchema {
  filter?: Record<string, any>;
  sort?: Record<string, any>;
  page: number;
  limit?: number;
  include?: string[];
  select?: string[];
}
