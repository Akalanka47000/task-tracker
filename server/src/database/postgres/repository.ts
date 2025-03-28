import { FindManyOptions, ObjectLiteral, Repository } from 'typeorm';

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

export class CustomRepository<Entity extends ObjectLiteral> extends Repository<Entity> {
  async paginate(options: QueryOptions) {
    const opts: FindManyOptions = {};

    if (options.filter) {
      opts.where = options.filter;
    }

    opts.order = {
      created_at: 'DESC',
      ...options.sort
    };

    if (!options.page) {
      return this.find(opts);
    }

    options.page = Number(options.page);
    options.limit = Number(options.limit) || 10;

    opts.take = options.limit;
    opts.skip = (options.page - 1) * opts.take;

    const [data, total] = await this.findAndCount(opts);

    const totalPages = Math.ceil(total / options.limit);
    let next: number | null = options.page + 1;
    if (next > totalPages) {
      next = null;
    }

    const prev = options.page - 1 || null;

    return {
      docs: data,
      totalDocs: total,
      limit: options.limit,
      page: options.page,
      totalPages,
      nextPage: next,
      prevPage: prev,
      hasPrevPage: options.page > 1,
      hasNextPage: options.page * options.limit < total
    } as PaginatedResult<Entity>;
  }
}
