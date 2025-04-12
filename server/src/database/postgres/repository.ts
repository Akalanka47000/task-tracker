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
  async paginate({
    query,
    ...options
  }: QueryOptions<Entity> & {
    query?: (opts: FindManyOptions<Entity>) => Promise<Entity[] | [Entity[], number]>;
  }) {
    const opts: FindManyOptions = {};

    if (options.filter) {
      opts.where = options.filter;
    }

    if (options.select) {
      opts.select = options.select;
    }

    opts.order = options.sort || {};

    if (!Object.keys(opts.order).length) {
      (opts.order as any).created_at = 'DESC';
    }

    if (!options.page) {
      return query ? query(opts) : this.find(opts);
    }

    options.limit ??= 10;

    opts.take = options.limit;
    opts.skip = (options.page - 1) * opts.take;

    const [data, total] = await (query ? query(opts) : this.findAndCount(opts));

    const totalPages = Math.ceil((total as number) / options.limit);
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
      hasNextPage: options.page * options.limit < (total as number)
    } as PaginatedResult<Entity>;
  }
}
