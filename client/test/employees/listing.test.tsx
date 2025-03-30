import { mockEmployeeListReponse, mockEmptyEmployeeListReponse, mockFilteredEmployeeListReponse } from 'test/__mocks__';
import { afterEach, expect, it, vi } from 'vitest';
import { EmployeeTable, testIds } from '@/components/employees';
import { userService } from '@/services';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { renderWithProviders, wait } from '../__utils__';

afterEach(cleanup);

it('render empty table when there are no employees', async () => {
  vi.spyOn(userService, 'getUsers').mockResolvedValue(mockEmptyEmployeeListReponse);
  renderWithProviders(<EmployeeTable />);
  const tableBody = screen.getByTestId(testIds.userList);
  await wait();
  expect(tableBody.children.length).toBe(1);
  expect(tableBody.children[0].textContent).toBe('No results.');
});

it('render table with items when are employees', async () => {
  vi.spyOn(userService, 'getUsers').mockResolvedValue(mockEmployeeListReponse);
  renderWithProviders(<EmployeeTable />);
  const tableBody = screen.getByTestId(testIds.userList);
  await wait();
  expect(tableBody.children.length).toBe(mockEmployeeListReponse.data.docs.length);
  Array.from(tableBody.children).forEach((child, index) => {
    expect(mockEmployeeListReponse.data.docs[index].id).toContain(child.children[0].textContent?.replace('...', ''));
    expect(child.children[1].textContent).toBe(mockEmployeeListReponse.data.docs[index].first_name);
    expect(child.children[2].textContent).toBe(mockEmployeeListReponse.data.docs[index].last_name);
    expect(child.children[3].textContent).toBe(mockEmployeeListReponse.data.docs[index].username);
  });
});

it('render table with filtered items when search value is specified', async () => {
  vi.spyOn(userService, 'getUsers').mockImplementation(async ({ options }) => {
    if (options?.params['filter[id]']) {
      return mockFilteredEmployeeListReponse;
    }
    return mockEmployeeListReponse;
  });
  renderWithProviders(<EmployeeTable />);
  const tableBody = screen.getByTestId(testIds.userList);

  await wait();
  expect(tableBody.children.length).toBe(mockEmployeeListReponse.data.docs.length);
  Array.from(tableBody.children).forEach((child, index) => {
    expect(child.children[1].textContent).toBe(mockEmployeeListReponse.data.docs[index].first_name);
  });

  const titleFilter = screen.getByTestId('filter-id');

  fireEvent.change(titleFilter, { target: { value: 'Something...' } });

  await wait(500);
  expect(tableBody.children.length).toBe(mockFilteredEmployeeListReponse.data.docs.length);
  Array.from(tableBody.children).forEach((child, index) => {
    expect(child.children[1].textContent).toBe(mockFilteredEmployeeListReponse.data.docs[index].first_name);
  });
});
