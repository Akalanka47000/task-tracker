export * from './schema';

global.preserveContext = function <T, K extends keyof T>(obj: T, method: K) {
  return (obj[method] as any).bind(obj);
};
