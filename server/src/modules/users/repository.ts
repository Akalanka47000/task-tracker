import { CustomRepository } from '@/database/postgres';
import { User } from './models';
import { DeepPartial, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository extends CustomRepository<User> {
  constructor(
    @InjectRepository(User) repository: Repository<User>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async insertOne(entity: DeepPartial<User>) {
    const result = await this.save(entity);
    return User.cleanse(result as any);
  }

  async findByUsername(username: string, plain = false) {
    const user = await this.findOneBy({ username });
    if (plain || !user) return user;
    return User.cleanse(user);
  }

  async findByID(id: string, plain = false) {
    const user = await this.findOneBy({ id });
    if (plain || !user) return user;
    return User.cleanse(user);
  }

  async findAll(opts: QueryOptions) {
    return this.paginate(opts)
  }

  async updatebyID(id: string, data: DeepPartial<IUser>) {
    await this.update(id, data);
    return this.findByID(id);
  }
}
