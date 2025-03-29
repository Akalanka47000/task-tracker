import { default as context } from 'express-http-context';
import { ctxUser, UserRole } from '@shared/constants';
import { DeepPartial, Repository } from 'typeorm';
import { CustomRepository } from '@/database/postgres';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './models';

@Injectable()
export class TaskRepository extends CustomRepository<Task> {
  constructor(@InjectRepository(Task) repository: Repository<Task>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  findByID(id: string) {
    return this.findOneBy({ id });
  }

  findAll(opts: QueryOptions<Task>) {
    const user: IUser = context.get(ctxUser);
    if (user.role === UserRole.Employee) {
      opts.filter = { ...opts.filter, employee: { id: user.id } };
    }
    return this.paginate(opts);
  }

  async updatebyID(id: string, data: DeepPartial<ITask>) {
    await this.update(id, data);
    return this.findByID(id);
  }
}
