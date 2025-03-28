import { traced } from '@sliit-foss/functions';
import { default as bcrypt } from 'bcryptjs';
import { UserRepository } from '@/modules/users/repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERRORS } from '../../constants';
import { Blacklist, JWT } from '../../utils';

const layer = 'repository';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserRepository) private repository: UserRepository) {}

  async login({ username, password }: Pick<IUser, 'username' | 'password'>) {
    const user = await traced[layer](preserveContext(this.repository, 'findByUsername'))(username, true);
    if (!user) throw ERRORS.INVALID_CREDENTIALS;
    if (!user.password || !bcrypt.compareSync(password!, user.password)) {
      throw ERRORS.INVALID_CREDENTIALS;
    }
    this.repository.updatebyID(user.id, { last_login_time: new Date() });
    return {
      user,
      ...JWT.generate(user)
    };
  }

  logout(token: string) {
    return Blacklist.add(token);
  }
}
