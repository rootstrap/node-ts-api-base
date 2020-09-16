import * as Faker from 'faker';
import request from 'supertest';
import { getRepository } from 'typeorm';
import app from '@app';
import connection from '@database/connection';
import { User } from '@entities/user.entity';
import { createJWT } from '@services/jwt.service';

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
  let user;
  let token;

  beforeEach(async () => {
    const userFields = {
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      email: Faker.internet.email(),
      password: Faker.internet.password(8)
    };
    user = await User.create(userFields).save();
    token = createJWT(user);
  });

  it('should return 401 without authentication', async () => {
    const response = await request(app).get(`${API}/users`);
    expect(response.status).toBe(401);
  });

  it('should return 200 with authentication token', async () => {
    const response = await request(app)
      .get(`${API}/users`)
      .set({ Authorization: token });
    expect(response.status).toBe(200);
  });

  it('should return the users', async () => {
    const response = await request(app)
      .get(`${API}/users`)
      .set({ Authorization: token });
    expect(response.header).toHaveProperty(
      'content-type',
      'application/json; charset=utf-8'
    );
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).not.toEqual([]);
  });
});

describe('when requesting one user', () => {
  let user;

  beforeEach(async () => {
    const userFields = {
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      email: Faker.internet.email(),
      password: Faker.internet.password(8)
    };
    user = await User.create(userFields).save();
  });

  it('should return 404 for non-existing user', async () => {
    const random = Math.round(Math.random() * 10);
    const response = await request(app).get(`${API}/users/${random}`);
    expect(response.status).toBe(404);
  });

  it('should return 200 for an existing user', async () => {
    const id = user.id;
    const response = await request(app).get(`${API}/users/${id}`);
    expect(response.status).toBe(200);
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

    const response = await request(app).post(`${API}/users`).send(userFields);
    expect(response.status).toBe(200);

    const userRepo = getRepository<User>(User);
    expect(await userRepo.count()).toBeGreaterThan(0);
  });
});

describe('when modifying a user', () => {
  let user;

  beforeEach(async () => {
    const userFields = {
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      email: Faker.internet.email(),
      password: Faker.internet.password(8)
    };
    user = await User.create(userFields).save();
  });

  it('should return 200 and update the record', async () => {
    const id = user.id;
    const newFields = {
      firstName: 'new firstname',
      lastName: 'new lastname',
    };
    const response = await request(app).put(`${API}/users/${id}`).send(newFields);
    expect(response.status).toBe(200);

    const updatedUser = await getRepository(User).findOne(id);
    expect(updatedUser?.firstName).toEqual(newFields.firstName);
    expect(updatedUser?.lastName).toEqual(newFields.lastName);
  });
});

describe('when deleting a user', () => {
  let user;

  beforeEach(async () => {
    const userFields = {
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      email: Faker.internet.email(),
      password: Faker.internet.password(8)
    };
    user = await User.create(userFields).save();
  });

  it('should return 200 and delete the record', async () => {
    const id = user.id;
    const userRepo = getRepository<User>(User);
    const beforeCount = await userRepo.count();
    const response = await request(app).delete(`${API}/users/${id}`);

    expect(response.status).toBe(200);
    expect(await userRepo.count()).toBeLessThan(beforeCount);
  });
});
