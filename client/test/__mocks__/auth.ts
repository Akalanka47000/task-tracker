import { EmployeeDepartment, UserRole } from '@shared/constants';
import { faker } from '@faker-js/faker';

export const mockEmployee = {
  id: faker.string.uuid(),
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  username: faker.internet.username(),
  role: UserRole.Employee,
  details: {
    department: EmployeeDepartment.HR
  },
  created_at: faker.date.past(),
  updated_at: faker.date.past()
} as IUser;

export const mockAdministrator = {
  id: faker.string.uuid(),
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  username: faker.internet.username(),
  role: UserRole.Administrator,
  created_at: faker.date.past(),
  updated_at: faker.date.past()
} as IUser;

export const mockCurrentEmployeeResponse = {
  data: mockEmployee,
  message: 'Auth user fetched successfully!'
};
