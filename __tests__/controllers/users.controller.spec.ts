import * as Faker from 'faker';
import request from 'supertest';
import connection from '../../src/database/connection';
import { getRepository } from 'typeorm';
import { User } from '../../src/entities/user.entity';
import app from '../../src/app';

const api = '/api/v1';

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
  it('should return 500 without authentication', async () => {
    const response = await request(app).get(`${api}/users`);
    expect(response.status).toBe(500);
  });
});

describe('when requesting one user', () => {
  it('should return 404 for non-existing user', async () => {
    const random = Math.round(Math.random() * 10);
    const response = await request(app).get(`${api}/users/${random}`);
    expect(response.status).toBe(404);
  });
});

describe('when creating a user', () => {
  it('should return 200 and create db record', async () => {
    const userFields = {
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      email: Faker.internet.email(),
      password: Faker.internet.password(8)
    };

    const response = await request(app).post(`${api}/users`).send(userFields);
    expect(response.status).toBe(200);

    const userRepo = getRepository<User>(User);
    expect(await userRepo.count()).toBeGreaterThan(0);
  });
});

describe('when modifying a user', () => {
  it('should return 200 and update the record', async () => {
    fail('TO DO...');
  });
});

describe('when deleting a user', () => {
  it('should return 200 and delete the record', async () => {
    fail('TO DO...');
  });
});
