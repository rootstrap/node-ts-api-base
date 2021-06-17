import request from 'supertest';
import { getRepository } from 'typeorm';
import { factory } from 'typeorm-seeding';
import app from '@app';
import { User } from '@entities/user.entity';
import { API } from '../../utils';

describe('deleting a user', () => {
  let user;

  beforeEach(async () => {
    user = await factory(User)().create({ password: 'password123' });
  });

  it('returns http code 200 and deletes the user', async () => {
    const id = user.id;
    const userRepo = getRepository<User>(User);
    const beforeCount = await userRepo.count();
    const response = await request(app).delete(`${API}/users/${id}`);

    expect(response.status).toBe(200);
    expect(await userRepo.count()).toBeLessThan(beforeCount);
  });
});
