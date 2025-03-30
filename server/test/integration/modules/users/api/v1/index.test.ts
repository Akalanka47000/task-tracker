import { UserRole } from '@shared/constants';
import { orderBy } from 'lodash';
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
        username: faker.person.firstName()
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
    // test('should fetch a user by id', async () => {
    //   const res = await request(app)
    //     .get(`/api/v1/users/${newlyCreatedUser._id}`)
    //     .set('Cookie', await sessionCookie(app));
    //   expect(res.status).toBe(200);
    //   expect(res.body.data).toMatchObject(newlyCreatedUser);
    // });
    // test('should update a user by id', async () => {
    //   const newTitle = faker.lorem.sentence();
    //   const res = await request(app)
    //     .patch(`/api/v1/users/${newlyCreatedUser._id}`)
    //     .send({ title: newTitle })
    //     .set('Cookie', await sessionCookie(app));
    //   expect(res.status).toBe(200);
    //   expect(res.body.data.title).toBe(newTitle);
    // });
    // test('should delete a user by id', async () => {
    //   let res = await request(app)
    //     .delete(`/api/v1/users/${newlyCreatedUser._id}`)
    //     .set('Cookie', await sessionCookie(app));
    //   expect(res.status).toBe(200);
    //   res = await request(app)
    //     .get(`/api/v1/users/${newlyCreatedUser._id}`)
    //     .set('Cookie', await sessionCookie(app));
    //   expect(res.status).toBe(404);
    // });
  });
  //   describe('should fetch a list of users', () => {
  //     const users = Array.from({ length: 20 }, (_) => ({
  //       title: faker.lorem.sentence(),
  //       priority: faker.helpers.arrayElement(Object.values(Priority).filter(Number)),
  //       recurring_interval: faker.helpers.arrayElement(Object.values(RecurringInterval))
  //     }));
  //     beforeAll(async () => {
  //       await Promise.all(
  //         users.map(async (t) => {
  //           return request(app)
  //             .post('/api/v1/users')
  //             .send(t)
  //             .set('Cookie', await sessionCookie(app));
  //         })
  //       );
  //     });
  //     test('should fetch users in pages of 5 ordered by created date at top', async () => {
  //       const res = await request(app)
  //         .get('/api/v1/users?page=1&limit=5')
  //         .set('Cookie', await sessionCookie(app));
  //       expect(res.status).toBe(200);
  //       expect(res.body.data.docs).toHaveLength(5);
  //       expect(res.body.data.totalDocs).toBe(users.length);
  //       expect(res.body.data.limit).toBe(5);
  //       expect(res.body.data.hasNextPage).toBe(true);
  //       expect(res.body.data.docs).toEqual(orderBy(res.body.data.docs, 'created_at', 'desc'));
  //     });
  //     test('should filter and fetch user', async () => {
  //       const res = await request(app)
  //         .get(`/api/v1/users?page=1&filter[title]=${users[5].title}`)
  //         .set('Cookie', await sessionCookie(app));
  //       expect(res.status).toBe(200);
  //       expect(res.body.data.docs.length).toBe(users.filter((t) => t.title === users[5].title).length);
  //     });
  //   });
});
