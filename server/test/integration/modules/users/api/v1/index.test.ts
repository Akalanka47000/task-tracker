import { EmployeeDepartment, UserRole } from '@shared/constants';
import { omit, orderBy } from 'lodash';
import { default as request } from 'supertest';
import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { adminSessionCookie, employeeSessionCookie } from '../../../../../__utils__';
import { getInitializedApp } from '../../../../bootstrap';

let app: INestApplication;

beforeAll(async () => {
  app = await getInitializedApp();
});

afterAll(async () => {
  await app.close();
});

describe('users', () => {
  describe('should only allow administrators to access routes', () => {
    test('should restrict unauthenticated requests', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/users?page=1');
      expect(res.status).toBe(401);
    });
    test('should restrict employees', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/users?page=1')
        .set('Cookie', await employeeSessionCookie(app.getHttpServer()));
      expect(res.status).toBe(403);
    });
  });

  describe('should create read update and delete users', () => {
    let newlyCreatedUser: IUser;
    test('should create a new employee', async () => {
      const payload = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        username: faker.person.firstName(),
        details: {
          department: EmployeeDepartment.IT
        }
      };
      const res = await request(app.getHttpServer())
        .post('/api/v1/users')
        .send(payload)
        .set('Cookie', await adminSessionCookie(app.getHttpServer()));
      expect(res.status).toBe(201);
      expect(res.body.data.first_name).toBe(payload.first_name);
      expect(res.body.data.role).toBe(UserRole.Employee);
      expect(res.body.data.id).toBeDefined();
      newlyCreatedUser = res.body.data;
    });
    test('should fetch a user by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/users/${newlyCreatedUser.id}`)
        .set('Cookie', await adminSessionCookie(app.getHttpServer()));
      expect(res.status).toBe(200);
      expect(res.body.data).toMatchObject(omit(newlyCreatedUser, 'password'));
    });
    test('should update a user by id', async () => {
      const newFirstName = faker.lorem.sentence();
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/users/${newlyCreatedUser.id}`)
        .send({ first_name: newFirstName })
        .set('Cookie', await adminSessionCookie(app.getHttpServer()));
      expect(res.status).toBe(200);
      expect(res.body.data.first_name).toBe(newFirstName);
    });
    test('should delete a user by id', async () => {
      let res = await request(app.getHttpServer())
        .delete(`/api/v1/users/${newlyCreatedUser.id}`)
        .set('Cookie', await adminSessionCookie(app.getHttpServer()));
      expect(res.status).toBe(200);
      res = await request(app.getHttpServer())
        .get(`/api/v1/users/${newlyCreatedUser.id}`)
        .set('Cookie', await adminSessionCookie(app.getHttpServer()));
      expect(res.status).toBe(404);
    });
  });

  describe('should fetch a list of users', () => {
    const users = Array.from({ length: 10 }, (_) => ({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      username: faker.person.firstName(),
      details: {
        department: faker.helpers.arrayElement(Object.values(EmployeeDepartment))
      }
    }));
    beforeAll(async () => {
      for (const u of users) {
        await request(app.getHttpServer())
          .post('/api/v1/users')
          .send(u)
          .set('Cookie', await adminSessionCookie(app.getHttpServer()));
      }
    });
    test('should fetch users in pages of 5 ordered by created date at top', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/users?page=1&limit=5')
        .set('Cookie', await adminSessionCookie(app.getHttpServer()));
      expect(res.status).toBe(200);
      expect(res.body.data.docs).toHaveLength(5);
      expect(res.body.data.totalDocs).toBe(users.length + 2);
      expect(res.body.data.limit).toBe(5);
      expect(res.body.data.hasNextPage).toBe(true);
      expect(res.body.data.docs).toEqual(orderBy(res.body.data.docs, 'created_at', 'desc'));
    });
    test('should filter and fetch user', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/users?page=1&filter[username]=${users[5].username}`)
        .set('Cookie', await adminSessionCookie(app.getHttpServer()));
      expect(res.status).toBe(200);
      expect(res.body.data.docs.length).toBe(users.filter((t) => t.username === users[5].username).length);
    });
  });
});
