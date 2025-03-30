import { mockCurrentEmployeeResponse } from 'test/__mocks__/auth';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Header, testIds } from '@/components/common/layout/header';
import { authService } from '@/services';
import { cleanup, screen } from '@testing-library/react';
import { renderWithProviders, wait } from '../__utils__';

afterEach(cleanup);

describe('render header', () => {
  it('with not logout button when not logged in', async () => {
    renderWithProviders(<Header />);
    await wait();
    expect(screen.queryByTestId(testIds.logoutButton)).toBeNull();
  });
  it('with logout button when logged in', async () => {
    vi.spyOn(authService, 'current').mockResolvedValue(mockCurrentEmployeeResponse);
    renderWithProviders(<Header />);
    await wait();
    expect(screen.queryByTestId(testIds.logoutButton)).not.toBeNull();
  });
});
