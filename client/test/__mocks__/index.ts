import { vi } from 'vitest';

export * from './auth';
export * from './intelligence';
export * from './tasks';
export * from './users';

class MockIntersectionObserver implements IntersectionObserver {
  root: Document | Element | null = null;
  rootMargin: string = ``;
  thresholds: readonly number[] = [];

  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn();
  unobserve = vi.fn();
}

window.IntersectionObserver = MockIntersectionObserver;
