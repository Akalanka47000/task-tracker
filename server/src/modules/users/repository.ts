import { DeepPartial, Repository } from 'typeorm';
import { CustomRepository } from '@/database/postgres';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models';

@Injectable()
export class UserRepository extends CustomRepository<User> {
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  async findByUsername(username: string, plain = false) {
    const user = await this.createQueryBuilder('users').where({ username }).addSelect('users.password').getOne();
    if (plain || !user) return user;
    return User.cleanse(user);
  }

  findByID(id: string) {
    return this.findOneBy({ id });
  }

  findAll(opts: QueryOptions<User>) {
    return this.paginate(opts);
  }

  async updatebyID(id: string, data: DeepPartial<IUser>) {
    await this.update(id, data);
    return this.findByID(id);
  }
}
