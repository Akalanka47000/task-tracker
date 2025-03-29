import {
  ICreateUserResponse,
  IUpdateUserResponse,
  RequestConfig,
  RequestCreateConfig,
  RequestDeleteConfig,
  RequestUpdateConfig
} from '@/types';
import { instance } from './core';

function getUsers({ v = 'v1', options }: RequestConfig) {
  return instance.get<unknown, IPaginatedAPIResponse<IUser>>(`/api/${v}/users`, options);
}

function createUser({ v = 'v1', data, options }: RequestCreateConfig) {
  return instance.post<unknown, ICreateUserResponse>(`/api/${v}/users`, data, options);
}

function updateUser({ v = 'v1', id, data, options }: RequestUpdateConfig) {
  return instance.patch<unknown, IUpdateUserResponse>(`/api/${v}/users/${id}`, data, options);
}

function deleteUser({ v = 'v1', id, options }: RequestDeleteConfig) {
  return instance.delete<unknown, ICreateUserResponse>(`/api/${v}/users/${id}`, options);
}

export default { getUsers, createUser, updateUser, deleteUser };
