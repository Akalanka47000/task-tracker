import { default as crypto } from 'crypto';
import { traced } from '@sliit-foss/functions';
import { default as bcrypt } from 'bcryptjs';
import { Config } from '@/config';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../repository';

const layer = 'repository';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserRepository) private repository: UserRepository) {}

  async create(user: Partial<IUser>) {
    const autoGeneratatedPassword = crypto.randomBytes(6).toString('hex');
    user.password = await bcrypt.hash(autoGeneratatedPassword, Config.SALT_ROUNDS);
    const result = await traced[layer](preserveContext(this.repository, 'save'))(user);
    result.password = autoGeneratatedPassword;
    return user;
  }

  getAll(retrievalOptions: QueryOptions) {
    return traced[layer](preserveContext(this.repository, 'findAll'))(retrievalOptions);
  }

  getById(id: string) {
    return traced[layer](preserveContext(this.repository, 'findByID'))(id);
  }

  updateById(id: string, data: Partial<IUser>) {
    return traced[layer](preserveContext(this.repository, 'updatebyID'))(id, data);
  }

  deleteById(id: string) {
    return traced[layer](preserveContext(this.repository, 'delete'))(id);
  }
}
