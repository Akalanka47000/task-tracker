import { afterEach, expect, it } from 'vitest';
import { EmployeeTable, testIds } from '@/components/employees';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { renderWithProviders, wait } from '../__utils__';

afterEach(cleanup);

it('open add employee dialog when clicked on button', async () => {
  renderWithProviders(<EmployeeTable />);
  expect(screen.queryByTestId(testIds.createDialog)).toBeNull();
  fireEvent.click(screen.getByTestId(testIds.createButton));
  await wait();
  const createDialog = screen.getByTestId(testIds.createDialog);
  expect(createDialog).toBeDefined();
  expect(createDialog.textContent).toContain('Add Employee');
});
