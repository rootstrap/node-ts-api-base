import * as Faker from 'faker';
import request from 'supertest';
import app from '@app';
import connection from '@database/connection';
import { User } from '@entities/user.entity';

const API = '/api/v1/auth';

beforeAll(async () => {
  await connection.create();
});

afterAll(async () => {
  await connection.close();
});

beforeEach(async () => {
  await connection.clear();
});

describe('when creating a sigup', () => {
  it('should return 200 whith valid params', async () => {
    const userFields = {
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      email: Faker.internet.email(),
      password: Faker.internet.password(8)
    };
    const response = await request(app).post(`${API}/signup`).send(userFields);
    expect(response.status).toBe(200);
  });
});

describe('when signing in', () => {
  let email;
  let password;

  beforeEach(async () => {
    const userFields = {
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      email: Faker.internet.email(),
      password: Faker.internet.password(8)
    };
    email = userFields.email
    password = userFields.password
    await User.create(userFields).save();
  });

  it('should return 200 whith valid params', async () => {
    const authFields = {
      email: email,
      password: password
    };
    const response = await request(app).post(`${API}/signin`).send(authFields);
    expect(response.status).toBe(200);
  });
});
