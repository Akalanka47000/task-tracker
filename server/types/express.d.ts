import Polyglot from 'node-polyglot';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }

    interface Response {
      polyglot: Polyglot;
    }
  }

  export interface QueryOptions {
    filter?: Record<string, any>;
    sort?: Record<string, any>;
    page?: number;
    limit?: number;
  }
}

export {};
