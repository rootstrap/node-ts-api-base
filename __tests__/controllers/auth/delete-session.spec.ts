import request from 'supertest';
import app from '@app';
import { factory } from 'typeorm-seeding';
import { User } from '@entities/user.entity';
import { API } from '../../utils';
import { genSaltSync, hashSync } from 'bcrypt';
import Container from 'typedi';
import { JWTService } from '@services/jwt.service';

describe('deleting a session', () => {
  let email;
  let password;
  let hashedPassword;
  let token;
  const jwtService = Container.get(JWTService);

  beforeEach(async () => {
    hashedPassword = hashSync('password123', genSaltSync());
    const user = await factory(User)().create({ password: hashedPassword });
    email = user.email;
    password = 'password123';
    token = await jwtService.createJWT(user);
  });

  it('returns http code 200 because was a correct logout', async () => {
    const authFields = {
      email,
      password
    };
    const response = await request(app)
      .post(`${API}/auth/logout`)
      .set({ Authorization: token })
      .send(authFields);
    expect(response.status).toBe(200);
  });

  it('returns http code 200 when the token starts with Bearer word', async () => {
    const authFields = {
      email,
      password
    };

    const tokenWithBearer = 'Bearer ' + token;

    const response = await request(app)
      .post(`${API}/auth/logout`)
      .set({ Authorization: tokenWithBearer })
      .send(authFields);
    expect(response.status).toBe(200);
  });

  it('returns http code 401 because the token was invalidated', async () => {
    const authFields = {
      email,
      password
    };
    await request(app)
      .post(`${API}/auth/logout`)
      .set({ Authorization: token })
      .send(authFields);
    const response = await request(app)
      .post(`${API}/auth/logout`)
      .set({ Authorization: token })
      .send(authFields);
    expect(response.status).toBe(401);
  });
});
