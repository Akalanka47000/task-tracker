import { Priority } from '@shared/constants';
import { faker } from '@faker-js/faker';

export const mockTask = () =>
  ({
    id: faker.string.uuid(),
    name: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    due_date: faker.date.future(),
    completed: false,
    priority: faker.helpers.arrayElement(Object.values(Priority).filter(Number)),
    employee_id: faker.string.uuid(),
    created_at: faker.date.past(),
    updated_at: faker.date.past()
  }) as ITask;

const mockTasks = Array.from({ length: 10 }, mockTask);

export const mockEmptyTaskListReponse: IPaginatedAPIResponse<ITask> = {
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
  message: 'Tasks fetched successfully!'
};

export const mockTaskListReponse: IPaginatedAPIResponse<ITask> = {
  data: {
    docs: mockTasks,
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

export const mockFilteredTaskListReponse: IPaginatedAPIResponse<ITask> = {
  data: {
    docs: mockTasks.splice(0, 3),
    totalDocs: 3,
    limit: 10,
    page: 1,
    totalPages: 5,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: 1
  },
  message: 'Tasks fetched successfully!'
};
