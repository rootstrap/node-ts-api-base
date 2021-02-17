import connection from '@database/connection';
import { Container } from 'typedi';
import { UsersService } from '@services/users.service';
import { genSaltSync, hashSync } from 'bcrypt';

let usersService;

beforeAll(async () => {
  await connection.create();
  usersService = Container.get(UsersService);
});

afterAll(async () => {
  await connection.close();
});

beforeEach(async () => {
  await connection.clear();
});

describe('given credentials', () => {
  let email;
  let password;

  beforeEach(() => {
    email = 'email@email.com';
    password = 'password';
  });

  it('checks that email and password are correct', () => {
    const result = usersService.givenCredentials(email, password);
    expect(result).toBeTruthy();
  });

  it('checks that password is empty', () => {
    const emptyPassword = '';
    const result = usersService.givenCredentials(email, emptyPassword);
    expect(result).toBeFalsy();
  });

  it('checks that email is empty', () => {
    const emptyEmail = '';
    const result = usersService.givenCredentials(emptyEmail, password);
    expect(result).toBeFalsy();
  });

  it('checks that email and password are empty', () => {
    const emptyEmail = '';
    const emptyPassword = '';
    const result = usersService.givenCredentials(emptyEmail, emptyPassword);
    expect(result).toBeFalsy();
  });
});

describe('compare password', () => {
  let userPassword;

  beforeEach(() => {
    userPassword = hashSync('password', genSaltSync());
  });

  it('checks that the password matches', () => {
    const hashedPassword = 'password';
    const result = usersService.comparePassword(hashedPassword, userPassword);
    expect(result).toBeTruthy();
  });

  it('checks that the password don\'t match', () => {
    const password = 'anotherpassword';
    const result = usersService.comparePassword(password, userPassword);
    expect(result).toBeFalsy();
  });
});
