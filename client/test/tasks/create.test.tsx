import { mockCurrentAdministratorResponse, mockCurrentEmployeeResponse } from 'test/__mocks__';
import { afterEach, expect, it, vi } from 'vitest';
import { TaskTable, testIds } from '@/components/tasks';
import { authService } from '@/services';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { renderWithProviders, wait } from '../__utils__';

afterEach(cleanup);

it('should not show task create button to employees', async () => {
  vi.spyOn(authService, 'current').mockResolvedValue(mockCurrentEmployeeResponse);
  renderWithProviders(<TaskTable />);
  await wait();
  expect(screen.queryByTestId(testIds.createButton)).toBeNull();
});

it('should show task create dialog to administrators', async () => {
  vi.spyOn(authService, 'current').mockResolvedValue(mockCurrentAdministratorResponse);
  renderWithProviders(<TaskTable />);
  await wait();
  expect(screen.queryByTestId(testIds.createButton)).not.toBeNull();
});

it('open add task dialog when clicked on button', async () => {
  vi.spyOn(authService, 'current').mockResolvedValue(mockCurrentAdministratorResponse);
  renderWithProviders(<TaskTable />);
  await wait();
  expect(screen.queryByTestId(testIds.createDialog)).toBeNull();
  fireEvent.click(screen.getByTestId(testIds.createButton));
  await wait();
  const createDialog = screen.getByTestId(testIds.createDialog);
  expect(createDialog).toBeDefined();
  expect(createDialog.textContent).toContain('Add Task');
});
