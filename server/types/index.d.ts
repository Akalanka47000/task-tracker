export * from './express';
export * from './redis';

declare global {
  function preserveContext<T, K extends keyof T>(obj: T, method: K): T[K];
}
