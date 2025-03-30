import { Priority } from '@shared/constants';
import { orderBy } from 'lodash';
import { default as request } from 'supertest';
import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { adminSessionCookie, employeeSessionCookie, getEmployee } from '../../../../../__utils__';
import { getInitializedApp } from '../../../../bootstrap';

let app: INestApplication;

beforeAll(async () => {
  app = await getInitializedApp();
});

afterAll(async () => {
  await app.close();
});

describe('tasks', () => {
  let employee: IUser;

  beforeAll(async () => {
    employee = await getEmployee(app.getHttpServer());
  });

  describe('should create read update and delete tasks', () => {
    let newlyCreatedTask: ITask;
    test('should create a new task', async () => {
      const payload = {
        name: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        priority: Priority.High,
        due_date: faker.date.future().toISOString(),
        employee_id: employee.id
      };
      const res = await request(app.getHttpServer())
        .post('/api/v1/tasks')
        .send(payload)
        .set('Cookie', await adminSessionCookie(app.getHttpServer()));
      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe(payload.name);
      expect(res.body.data.id).toBeDefined();
      newlyCreatedTask = res.body.data;
    });
    test('employee should see added task', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/tasks?page=1`)
        .set('Cookie', await employeeSessionCookie(app.getHttpServer()));
      expect(res.status).toBe(200);
      expect(res.body.data.docs[0]).toMatchObject(newlyCreatedTask);
    });
    test('should fetch a task by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/tasks/${newlyCreatedTask.id}`)
        .set('Cookie', await adminSessionCookie(app.getHttpServer()));
      expect(res.status).toBe(200);
      expect(res.body.data).toMatchObject(newlyCreatedTask);
    });
    test('should update a task by id', async () => {
      const newName = faker.lorem.sentence();
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/tasks/${newlyCreatedTask.id}`)
        .send({ name: newName })
        .set('Cookie', await adminSessionCookie(app.getHttpServer()));
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe(newName);
    });
    test('should delete a task by id', async () => {
      let res = await request(app.getHttpServer())
        .delete(`/api/v1/tasks/${newlyCreatedTask.id}`)
        .set('Cookie', await adminSessionCookie(app.getHttpServer()));
      expect(res.status).toBe(200);
      res = await request(app.getHttpServer())
        .get(`/api/v1/tasks/${newlyCreatedTask.id}`)
        .set('Cookie', await adminSessionCookie(app.getHttpServer()));
      expect(res.status).toBe(404);
    });
  });

  describe('should fetch a list of tasks', () => {
    let tasks: Partial<ITask>[];
    beforeAll(async () => {
      tasks = Array.from({ length: 10 }, (_) => ({
        name: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        priority: faker.helpers.arrayElement(Object.values(Priority).filter(Number)) as any,
        due_date: faker.date.future().toISOString() as any,
        employee_id: employee.id
      }));
      for (const u of tasks) {
        await request(app.getHttpServer())
          .post('/api/v1/tasks')
          .send(u)
          .set('Cookie', await adminSessionCookie(app.getHttpServer()));
      }
    });
    test('should fetch tasks in pages of 5 ordered by created date at top', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/tasks?page=1&limit=5')
        .set('Cookie', await adminSessionCookie(app.getHttpServer()));
      expect(res.status).toBe(200);
      expect(res.body.data.docs).toHaveLength(5);
      expect(res.body.data.totalDocs).toBe(tasks.length);
      expect(res.body.data.limit).toBe(5);
      expect(res.body.data.hasNextPage).toBe(true);
      expect(res.body.data.docs).toEqual(orderBy(res.body.data.docs, 'created_at', 'desc'));
    });
    test('should filter and fetch task', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/tasks?page=1&filter[name]=${tasks[5].name}`)
        .set('Cookie', await adminSessionCookie(app.getHttpServer()));
      expect(res.status).toBe(200);
      expect(res.body.data.docs.length).toBe(tasks.filter((t) => t.name === tasks[5].name).length);
    });
  });
});
