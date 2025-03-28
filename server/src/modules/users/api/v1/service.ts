import { traced } from '@sliit-foss/functions';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../repository';
import { hashPasswordIfProvided } from '../../utils';

const layer = 'repository';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserRepository) private repository: UserRepository) { }

  async create(user: Partial<IUser>) {
    await hashPasswordIfProvided(user);
    return traced[layer](this.repository.insertOne)(user);
  }

  async getAll(retrievalOptions: QueryOptions) {
    return this.repository.findAll(retrievalOptions);
  }

  async getById(id: string) {
    return traced[layer](this.repository.findByID)(id);
  }

  async updateById(id: string, data: Partial<IUser>) {
    await hashPasswordIfProvided(data);
    return traced[layer](this.repository.updatebyID)(id, data);
  }

  async deleteById(id: string) {
    return traced[layer](this.repository.delete)(id);
  }
}