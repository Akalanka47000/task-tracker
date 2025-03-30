import { default as request } from 'supertest';
import { App } from 'supertest/types';
import { mockAdminCredentials, mockEmployeeCredentials } from '../__mocks__';

const extractCookie = (cookie: string) => {
  return `access_token=${cookie.split('=')[1].split(';')[0]}`;
};

export const adminSessionCookie = async (app: App, credentials?: Pick<IUser, 'username' | 'password'>) => {
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send(
      credentials || {
        username: mockAdminCredentials.username,
        password: mockAdminCredentials.password
      }
    );
  return extractCookie(res.headers['set-cookie'][0]);
};

export const employeeSessionCookie = async (app: App, credentials?: Pick<IUser, 'username' | 'password'>) => {
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send(
      credentials || {
        username: mockEmployeeCredentials.username,
        password: mockEmployeeCredentials.password
      }
    );
  return extractCookie(res.headers['set-cookie'][0]);
};

export const getEmployee = async (app: App) => {
  const res = await request(app).post('/api/v1/auth/login').send({
    username: mockEmployeeCredentials.username,
    password: mockEmployeeCredentials.password
  });
  console.log(res.body, 234);
  return res.body.data;
};
