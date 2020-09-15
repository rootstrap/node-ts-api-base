import * as Faker from 'faker';
import request from 'supertest';
import { getRepository } from 'typeorm';
import app from '@app';
import connection from '@database/connection';
import { User } from '@entities/user.entity';

const API = '/api/v1';

beforeAll(async () => {
  await connection.create();
});

afterAll(async () => {
  await connection.close();
});

beforeEach(async () => {
  await connection.clear();
});

describe('when requesting all users', () => {
  it('should return 401 without authentication', async () => {
    const response = await request(app).get(`${API}/users`);
    expect(response.status).toBe(401);
  });
});

describe('when requesting one user', () => {
  it('should return 404 for non-existing user', async () => {
    const random = Math.round(Math.random() * 10);
    const response = await request(app).get(`${API}/users/${random}`);
    expect(response.status).toBe(404);
  });
});

describe('when creating a user', () => {
  it('should return 200 and create db record', async () => {
    const userFields = {
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      email: Faker.internet.email(),
      password: Faker.internet.password(8),
      age: Math.round(Math.random() * 20)
    };

    const response = await request(app).post(`${API}/users`).send(userFields);
    expect(response.status).toBe(200);

    const userRepo = getRepository<User>(User);
    expect(await userRepo.count()).toBeGreaterThan(0);
  });
});

describe('when modifying a user', () => {
  it.skip('should return 200 and update the record', async () => {
    fail('TO DO...');
  });
});

describe('when deleting a user', () => {
  it.skip('should return 200 and delete the record', async () => {
    fail('TO DO...');
  });
});
