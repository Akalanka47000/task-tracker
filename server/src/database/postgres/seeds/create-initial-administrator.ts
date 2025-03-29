import { UserRole } from '@shared/constants';
import { default as bcrypt } from 'bcryptjs';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Config } from '@/config';
import { User } from '@/modules/users/models';
import { faker } from '@faker-js/faker';

export default class CreateInitialAdministrator implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(User);
    const adminUser = await repository.findOneBy({ username: 'admin' });
    if (adminUser) return;
    await repository.insert({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      username: 'admin',
      password: bcrypt.hashSync('Ackg82!2#secret', Config.SALT_ROUNDS),
      role: UserRole.Administrator
    });
  }
}
