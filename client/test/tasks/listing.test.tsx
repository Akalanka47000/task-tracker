import { mockEmptyTaskListReponse, mockFilteredTaskListReponse, mockTaskListReponse } from 'test/__mocks__';
import { afterEach, expect, it, vi } from 'vitest';
import { TaskTable, testIds } from '@/components/tasks';
import { taskService } from '@/services';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { renderWithProviders, wait } from '../__utils__';

afterEach(cleanup);

it('render empty table when there are no tasks', async () => {
  vi.spyOn(taskService, 'getTasks').mockResolvedValue(mockEmptyTaskListReponse);
  renderWithProviders(<TaskTable />);
  const tableBody = screen.getByTestId(testIds.taskList);
  await wait();
  expect(tableBody.children.length).toBe(1);
  expect(tableBody.children[0].textContent).toBe('No results.');
});

it('render table with items when are tasks', async () => {
  vi.spyOn(taskService, 'getTasks').mockResolvedValue(mockTaskListReponse);
  renderWithProviders(<TaskTable />);
  const tableBody = screen.getByTestId(testIds.taskList);
  await wait();
  expect(tableBody.children.length).toBe(mockTaskListReponse.data.docs.length);
  Array.from(tableBody.children).forEach((child, index) => {
    expect(child.children[0].textContent).toBe(mockTaskListReponse.data.docs[index].name);
    expect(mockTaskListReponse.data.docs[index].description).toContain(
      child.children[1].textContent?.replace('...', '')
    );
  });
});

it('render table with filtered items when search value is specified', async () => {
  vi.spyOn(taskService, 'getTasks').mockImplementation(async ({ options }) => {
    if (options?.params['filter[name]']) {
      return mockFilteredTaskListReponse;
    }
    return mockTaskListReponse;
  });
  renderWithProviders(<TaskTable />);
  const tableBody = screen.getByTestId(testIds.taskList);

  await wait();
  expect(tableBody.children.length).toBe(mockTaskListReponse.data.docs.length);
  Array.from(tableBody.children).forEach((child, index) => {
    expect(child.children[0].textContent).toBe(mockTaskListReponse.data.docs[index].name);
  });

  const titleFilter = screen.getByTestId('filter-name');

  fireEvent.change(titleFilter, { target: { value: 'Something...' } });

  await wait(500);
  expect(tableBody.children.length).toBe(mockFilteredTaskListReponse.data.docs.length);
  Array.from(tableBody.children).forEach((child, index) => {
    expect(child.children[0].textContent).toBe(mockFilteredTaskListReponse.data.docs[index].name);
  });
});
