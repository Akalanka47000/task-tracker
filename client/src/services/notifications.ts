import { RequestCreateConfig } from '@/types';
import { instance } from './core';

function registerDevice({ v = 'v1', data, options }: RequestCreateConfig) {
  return instance.post(`/api/${v}/notifications/register`, data, options);
}

export default { registerDevice };
