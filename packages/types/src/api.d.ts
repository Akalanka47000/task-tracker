declare global {
  export type PaginatedResult<T> = {
    docs: T[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
    hasPrevPage: boolean;
    hasNextPage: boolean;
  };
  interface IAPIResponse<T = undefined> {
    data: T;
    message: string;
  }
  interface IPaginatedAPIResponse<T> {
    data: PaginatedResult<T>;
    message: string;
  }
}

export {};
