import request from 'supertest';
import { getRepository } from 'typeorm';
import { factory } from 'typeorm-seeding';
import app from '@app';
import { User } from '@entities/user.entity';
import { API } from '../../utils';

describe('updating a user', () => {
  let user;

  beforeEach(async () => {
    user = await factory(User)().create();
  });

  it('returns http code 200 and updates the user', async () => {
    const id = user.id;
    user.firstName = 'new firstname';
    user.lastName = 'new lastname';
    const response = await request(app).put(`${API}/users/${id}`).send(user);
    expect(response.status).toBe(200);

    const updatedUser = await getRepository(User).findOne(id);
    expect(updatedUser?.firstName).toEqual(user.firstName);
    expect(updatedUser?.lastName).toEqual(user.lastName);
  });
});
