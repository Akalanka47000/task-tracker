export * from './auth';
export * from './common';
export * from './tasks';
export * from './users';

export interface GetQueryProps {
  params?: Record<string, any>;
}

export interface GetPaginatedQueryProps {
  page?: number;
  limit?: number;
  params?: Record<string, any>;
}
