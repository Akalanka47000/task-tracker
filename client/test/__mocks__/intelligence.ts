import { EmployeeDepartment } from '@shared/constants';
import { faker } from '@faker-js/faker';

export const mockEmployeeInsight = () =>
  ({
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    username: faker.internet.username(),
    details: {
      department: faker.helpers.arrayElement(Object.values(EmployeeDepartment))
    },
    total_tasks: 100,
    completed_tasks: 50,
    overdue_tasks: 10,
    completion_percentage: 50
  }) as IEmployeeInsight;

const mockEmployeeInsights = Array.from({ length: 10 }, mockEmployeeInsight);

export const mockSystemInsightsResponse: IAPIResponse<ISystemInsights> = {
  data: {
    total_employees: 100,
    total_tasks: 50,
    completed_tasks: 25,
    overdue_tasks: 20
  },
  message: 'System insights fetched successfully!'
};

export const mockEmployeeInsightListReponse: IPaginatedAPIResponse<IEmployeeInsight> = {
  data: {
    docs: mockEmployeeInsights,
    totalDocs: 50,
    limit: 10,
    page: 1,
    totalPages: 5,
    hasPrevPage: false,
    hasNextPage: true,
    prevPage: null,
    nextPage: 1
  },
  message: 'Tasks fetched successfully!'
};
