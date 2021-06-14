import request from 'supertest';
import app from '@app';
import { factory } from 'typeorm-seeding';
import { User } from '@entities/user.entity';
import { RATE_LIMIT_MAX_REQUESTS } from '@config';
import { genSaltSync, hashSync } from 'bcrypt';
import { API } from '../utils';

describe('creating an account', () => {
  it('returns http code 200 whith valid params', async () => {
    const userFields = await factory(User)().make();
    const response = await request(app)
      .post(`${API}/auth/signup`)
      .send(userFields);
    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty('password');
  });

  it('returns http code 400 whith invalid params', async () => {
    const userFields = {};
    const response = await request(app)
      .post(`${API}/auth/signup`)
      .send(userFields);
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        errMessage: expect.any(String),
        errCode: expect.any(Number)
      })
    );
  });
});

describe('creating a session', () => {
  let email;
  let password;
  let hashedPassword;

  beforeEach(async () => {
    hashedPassword = hashSync('password123', genSaltSync());
    const user = await factory(User)().create({ password: hashedPassword });
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
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        errMessage: expect.any(String),
        errCode: expect.any(Number)
      })
    );
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
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        message: expect.any(String),
        status: expect.any(Number)
      })
    );
  });
});
