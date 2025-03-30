import { MemoryRouter } from 'react-router-dom';
import { default as Providers } from '@/providers';
import { render } from '@testing-library/react';

export const renderWithProviders = (ui: React.ReactNode | React.ReactNode[]) => {
  render(
    <MemoryRouter>
      <Providers>{ui}</Providers>
    </MemoryRouter>
  );
};

/**
 * @description Waits for some ui updates to complete
 */
export const wait = (duration = 125) => new Promise((resolve) => setTimeout(resolve, duration));
