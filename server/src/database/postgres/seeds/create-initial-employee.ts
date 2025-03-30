import { UserRole } from '@shared/constants';
import { default as bcrypt } from 'bcryptjs';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Config } from '@/config';
import { User } from '@/modules/users/models';
import { faker } from '@faker-js/faker';

export default class CreateInitialEmployee implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(User);
    const employee = await repository.findOneBy({ username: 'employee1' });
    if (employee) return;
    await repository.insert({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      username: 'employee1',
      password: bcrypt.hashSync('Ecvb841@2#secret', Config.SALT_ROUNDS),
      role: UserRole.Employee
    });
  }
}
