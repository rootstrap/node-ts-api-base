import request from 'supertest';
import app from '@app';
import connection from '@database/connection';
import { API } from '../utils';
import { factory, useSeeding } from 'typeorm-seeding';
import { User } from '@entities/user.entity';

beforeAll(async () => {
  await connection.create();
  await useSeeding();
});

afterAll(async () => {
  await connection.close();
});

beforeEach(async () => {
  await connection.clear();
});

describe('creating an account', () => {
  it('returns http code 200 whith valid params', async () => {
    const userFields = await factory(User)().make();
    const response = await request(app)
      .post(`${API}/auth/signup`)
      .send(userFields);
    expect(response.status).toBe(200);
  });

  it('returns http code 400 whith invalid params', async () => {
    const userFields = {};
    const response = await request(app)
      .post(`${API}/auth/signup`)
      .send(userFields);
    expect(response.status).toBe(400);
  });
});

describe('creating a session', () => {
  let email;
  let password;

  beforeEach(async () => {
    const user = await factory(User)().create({ password: 'password123' });
    email = user.email;
    password = 'password123';
  });

  it('returns http code 200 whith valid params', async () => {
    const authFields = {
      email: email,
      password: password
    };
    const response = await request(app)
      .post(`${API}/auth/signin`)
      .send(authFields);
    expect(response.status).toBe(200);
  });

  it('returns http code 401 whith invalid params', async () => {
    const authFields = {
      email: 'r4nD0m@3M4Il.com',
      password: 'r4Nd0mPa55w0rD'
    };
    const response = await request(app)
      .post(`${API}/auth/signin`)
      .send(authFields);
    expect(response.status).toBe(401);
  });
});
