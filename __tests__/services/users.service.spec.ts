import 'reflect-metadata';
import connection from '@database/connection';
import { Container } from 'typedi';
import { UsersService } from '@services/users.service';
import { useSeeding } from 'typeorm-seeding';
import { useContainer } from 'typeorm';

beforeAll(async () => {
  useContainer(Container);

  await connection.create();
  await useSeeding();
});

afterAll(async () => {
  await connection.close();
});

beforeEach(async () => {
  await connection.clear();
});

describe('credentials', () => {
  let email;
  let password;

  const usersService = Container.get(UsersService);

  beforeEach(() => {
    email = 'email@email.com';
    password = 'password';
  });

  it('checks that email and password exists', () => {
    const result = usersService.givenCredentials(email, password);
    expect(result).toBe(true);
  });
});
