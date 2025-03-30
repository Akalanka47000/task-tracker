import {
  mockCurrentAdministratorResponse,
  mockCurrentEmployeeResponse,
  mockEmployeeInsightListReponse,
  mockSystemInsightsResponse
} from 'test/__mocks__';
import { afterEach, beforeAll, expect, it, vi } from 'vitest';
import { testIds as employeeInsightTestIds } from '@/components/analytics/employee-insights';
import { testIds as systemInsighTestIds } from '@/components/analytics/system-insights';
import { Dashboard } from '@/pages/dashboard';
import { authService, intelligenceService } from '@/services';
import { cleanup, screen } from '@testing-library/react';
import { renderWithProviders, wait } from '../__utils__';

afterEach(cleanup);

beforeAll(() => {
  vi.spyOn(intelligenceService, 'getSystemInsights').mockResolvedValue(mockSystemInsightsResponse);
  vi.spyOn(intelligenceService, 'getEmployeeInsights').mockResolvedValue(mockEmployeeInsightListReponse);
});

it('should not show analytics to employees', async () => {
  vi.spyOn(authService, 'current').mockResolvedValue(mockCurrentEmployeeResponse);
  renderWithProviders(<Dashboard />);
  await wait();
  expect(screen.queryByTestId(employeeInsightTestIds.employeeInsights)).toBeNull();
  expect(screen.queryByTestId(systemInsighTestIds.systemInsights)).toBeNull();
});

it('should show analytics to administrators', async () => {
  vi.spyOn(authService, 'current').mockResolvedValue(mockCurrentAdministratorResponse);
  renderWithProviders(<Dashboard />);
  await wait();
  expect(screen.queryByTestId(employeeInsightTestIds.employeeInsights)).not.toBeNull();
  expect(screen.queryByTestId(systemInsighTestIds.systemInsights)).not.toBeNull();
});
