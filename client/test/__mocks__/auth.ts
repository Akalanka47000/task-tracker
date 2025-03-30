import { mockAdministrator, mockEmployee } from './users';

export const mockCurrentEmployeeResponse = {
  data: mockEmployee(),
  message: 'Auth user fetched successfully!'
};

export const mockCurrentAdministratorResponse = {
  data: mockAdministrator,
  message: 'Auth user fetched successfully!'
};
