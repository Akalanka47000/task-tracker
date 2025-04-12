import Polyglot from 'node-polyglot';
import { FindOptionsOrder, type FindOptionsWhere } from 'typeorm';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }

    interface Response {
      polyglot: Polyglot;
    }
  }

  export interface QueryOptions<T> {
    filter?: FindOptionsWhere<T>;
    sort?: FindOptionsOrder<T>;
    page?: number;
    limit?: number;
    select?: string[];
  }
}

export {};
