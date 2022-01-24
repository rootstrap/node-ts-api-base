import { Container } from 'typedi';
import { genSaltSync, hashSync } from 'bcrypt';
import { UsersService } from '@services/users.service';
import { API } from '../utils';
import request from 'supertest';
import { factory } from 'typeorm-seeding';
import { User } from '@entities/user.entity';
import app from '@app';
import { HttpStatusCode } from '@constants/httpStatusCode';
import { ErrorsMessages } from '@constants/errorMessages';
import { getRepository, Repository, UpdateResult } from 'typeorm';
import { mockUpdateResult } from '../utils/mocks';

let usersService: UsersService;

beforeAll(async () => {
  usersService = Container.get(UsersService);
});

describe('compare password', () => {
  let userPassword: string;

  beforeEach(() => {
    userPassword = hashSync('password', genSaltSync());
  });

  it('checks that the password matches', () => {
    const hashedPassword = 'password';
    const result = usersService.comparePassword({
      password: hashedPassword,
      userPassword
    });
    expect(result).toBeTruthy();
  });

  it("checks that the password don't match", () => {
    const password = 'anotherpassword';
    const result = usersService.comparePassword({ password, userPassword });
    expect(result).toBeFalsy();
  });
});

describe('verifying an account', () => {
  beforeEach(async () => {
    user = await factory(User)().create();
  });

  beforeAll(async () => {
    usersService = Container.get(UsersService);
    userRepository = getRepository<User>(User);
  });

  let user: User;
  let userRepository: Repository<User>;

  it('checks the hash is invalid', async () => {
    const verifyHash = '11111111-2222-3333-4444-555555555555';

    jest.spyOn(userRepository, 'findOne')
      .mockRejectedValueOnce(new Error(ErrorsMessages.HASH_NOT_VALID));

    expect(usersService.verifyUser(verifyHash)).rejects.toThrowError(Error);
  });

  it('checks the hash is expired', async () => {
    const verifyHash = '11111111-2222-3333-4444-555555555555';

    jest.spyOn(userRepository, 'findOne')
      .mockRejectedValueOnce(new Error(ErrorsMessages.HASH_EXPIRED));

    expect(usersService.verifyUser(verifyHash)).rejects.toThrowError(Error);
  });

  it('checks the user is verified', async () => {
    user = await factory(User)().make();

    jest.spyOn(userRepository, 'findOne')
      .mockResolvedValueOnce(user);
    jest.spyOn(userRepository, 'update')
      .mockResolvedValueOnce( mockUpdateResult as UpdateResult );

    if (user.verifyHash) {
      const userVerified = await usersService.verifyUser(user.verifyHash);
      expect(userVerified).toHaveProperty('verified', true);
      expect(userVerified).toHaveProperty('verifyHash', null);
      expect(userVerified).toHaveProperty('hashExpiresAt', null);
    }
  });

  it('returns http code 500 with expired hash', async () => {
    user = await factory(User)().create({ hashExpiresAt: new Date() });
    const failingResponse = await request(app)
      .get(`${API}/users/verify/?key=${user.verifyHash}`);
    expect(failingResponse.status).toBe(406);
    expect(failingResponse.body).toStrictEqual({
      description: expect.stringContaining(ErrorsMessages.HASH_EXPIRED),
      httpCode: HttpStatusCode.NOT_ACCEPTABLE,
      name: 'Error'
    });
  });

  it('returns http code 500 with invalid hash', async () => {
    user.verifyHash = '11111111-2222-3333-4444-555555555555';
    const failingResponse = await request(app)
      .get(`${API}/users/verify/?key=${user.verifyHash}`);
    expect(failingResponse.status).toBe(400);
    expect(failingResponse.body).toStrictEqual({
      description: expect.stringContaining(ErrorsMessages.HASH_NOT_VALID),
      httpCode: HttpStatusCode.BAD_REQUEST,
      name: 'Error'
    });
  });

  it('returns http code 200 with valid params', async () => {
    const response = await request(app)
      .get(`${API}/users/verify/?key=${user.verifyHash}`);
    expect(response.status).toBe(200);
    expect(response.body.verified).toBe(true);
    expect(response.body.hashExpiresAt).toBe(null);
    expect(response.body.verifyHash).toBe(null);
  });
});
