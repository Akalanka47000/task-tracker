import { default as request } from 'supertest';
import { INestApplication } from '@nestjs/common';
import { mockAdminCredentials } from '../../../../../__mocks__';
import { adminSessionCookie } from '../../../../../__utils__';
import { getInitializedApp } from '../../../../bootstrap';

let app: INestApplication;

beforeAll(async () => {
  app = await getInitializedApp();
});

afterAll(async () => {
  await app.close();
});

describe('authentication', () => {
  test('should successfully login', async () => {
    const res = await request(app.getHttpServer()).post('/api/v1/auth/login').send({
      username: mockAdminCredentials.username,
      password: mockAdminCredentials.password
    });
    expect(res.status).toBe(200);
    expect(res.body.data.username).toBe(mockAdminCredentials.username);
    expect(res.body.data.password).toBeUndefined();
    expect(res.headers['set-cookie'][0]).toContain('access_token');
    expect(res.headers['set-cookie'][1]).toContain('refresh_token');
  });
  test('should successfully logout', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/logout')
      .set('Cookie', await adminSessionCookie(app.getHttpServer()));
    expect(res.status).toBe(200);
  });
});
