import request from 'supertest';
import app from '@app';
import connection from '@database/connection';
import { API, confirmedUser } from '../utils';
import { factory, useSeeding } from 'typeorm-seeding';
import { User } from '@entities/user.entity';
import { RATE_LIMIT_MAX_REQUESTS } from '@config';

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
  let user;

  beforeEach(async () => {
    user = await factory(User)().create({ password: 'password123' });
    email = user.email;
    password = 'password123';
  });

  describe('with an unconfirmed user', () => {
    it('returns http code 401', async () => {
      const authFields = {
        email: email,
        password: password
      };
      const response = await request(app)
        .post(`${API}/auth/signin`)
        .send(authFields);
      expect(response.status).toBe(401);
    });
  });

  describe('with a confirmed user', () => {
    beforeEach(async () => {
      user = await confirmedUser(user);
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
});

describe('calling multiple times an endpoint', () => {
  it('returns http code 429 with message too many requests', async () => {
    let response;
    for (
      let index = 0;
      index < Number.parseInt(RATE_LIMIT_MAX_REQUESTS || '100') + 1;
      index++
    ) {
      response = await request(app).post(`${API}/auth/signin`);
    }
    expect(response.status).toBe(429);
  });
});
