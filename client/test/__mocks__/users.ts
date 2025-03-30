import { EmployeeDepartment, UserRole } from '@shared/constants';
import { faker } from '@faker-js/faker';

export const mockAdministrator = {
  id: faker.string.uuid(),
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  username: faker.internet.username(),
  role: UserRole.Administrator,
  created_at: faker.date.past(),
  updated_at: faker.date.past()
} as IUser;

export const mockEmployee = () =>
  ({
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    username: faker.internet.username(),
    role: UserRole.Employee,
    details: {
      department: faker.helpers.arrayElement(Object.values(EmployeeDepartment))
    },
    created_at: faker.date.past(),
    updated_at: faker.date.past()
  }) as IUser;

const mockEmployees = Array.from({ length: 10 }, mockEmployee);

export const mockEmptyEmployeeListReponse: IPaginatedAPIResponse<IUser> = {
  data: {
    docs: [],
    totalDocs: 0,
    limit: 10,
    page: 1,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null
  },
  message: 'Users fetched successfully!'
};

export const mockEmployeeListReponse: IPaginatedAPIResponse<IUser> = {
  data: {
    docs: mockEmployees,
    totalDocs: 50,
    limit: 10,
    page: 1,
    totalPages: 5,
    hasPrevPage: false,
    hasNextPage: true,
    prevPage: null,
    nextPage: 1
  },
  message: 'Users fetched successfully!'
};

export const mockFilteredEmployeeListReponse: IPaginatedAPIResponse<IUser> = {
  data: {
    docs: mockEmployees.splice(0, 3),
    totalDocs: 3,
    limit: 10,
    page: 1,
    totalPages: 5,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: 1
  },
  message: 'Users fetched successfully!'
};
