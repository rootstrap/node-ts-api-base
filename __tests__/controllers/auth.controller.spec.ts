import request from 'supertest';
import app from '@app';
import connection from '@database/connection';
import { API, mockUserFields } from '../utils/index';
import { factory, useSeeding } from 'typeorm-seeding';
import { User } from '@entities/user.entity';

beforeAll(async () => {
  await useSeeding();
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
    const userFields = mockUserFields();
    const response = await request(app).post(`${API}/auth/signup`).send(userFields);
    expect(response.status).toBe(200);
  });
});

describe('when signing in', () => {
  let email;
  let password;

  beforeEach(async () => {
    const user = await factory(User)().create({ password: 'password123' });
    email = user.email
    password = 'password123'
  });

  it('should return 200 whith valid params', async () => {
    const authFields = {
      email: email,
      password: password
    };
    const response = await request(app).post(`${API}/auth/signin`).send(authFields);
    expect(response.status).toBe(200);
  });
});
