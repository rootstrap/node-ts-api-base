import request from 'supertest';
import { getRepository } from 'typeorm';
import { factory } from 'typeorm-seeding';
import app from '@app';
import { User } from '@entities/user.entity';
import { API } from '../../utils';

describe('updating a user', () => {
  let user: User;
  let newUser: User;

  beforeEach(async () => {
    user = await factory(User)().create();
  });

  it('returns http code 200 and updates the user', async () => {
    newUser = await factory(User)().create();

    const id = user.id;
    user.firstName = newUser.firstName;
    user.lastName = newUser.lastName;
    user.gender = newUser.gender;

    const response = await request(app).put(`${API}/users/${id}`).send(user);
    expect(response.status).toBe(200);

    const updatedUser = await getRepository(User).findOne(id);
    expect(updatedUser?.firstName).toEqual(user.firstName);
    expect(updatedUser?.lastName).toEqual(user.lastName);
    expect(updatedUser?.gender).toEqual(user.gender);
  });
});
