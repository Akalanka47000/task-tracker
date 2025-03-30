import { RequestConfig } from '@/types';
import { instance } from './core';

function getEmployeeInsights({ v = 'v1', options }: RequestConfig) {
  return instance.get<unknown, IPaginatedAPIResponse<IEmployeeInsight>>(`/api/${v}/intelligence/employees`, options);
}

function getSystemInsights({ v = 'v1', options }: RequestConfig) {
  return instance.get<unknown, IAPIResponse<ISystemInsights>>(`/api/${v}/intelligence/summary`, options);
}

export default { getEmployeeInsights, getSystemInsights };
