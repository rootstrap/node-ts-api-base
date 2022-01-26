import { Container } from 'typedi';
import { genSaltSync, hashSync } from 'bcrypt';
import { UsersService } from '@services/users.service';
import { factory } from 'typeorm-seeding';
import { User } from '@entities/user.entity';
import { getRepository, Repository } from 'typeorm';
import { mockUpdateResult } from '../utils/mocks';
import { HashInvalidError } from '@exception/users/hash-invalid.error';
import { HashExpiredError } from '@exception/users/hash-expired.error';
import * as faker from 'faker';

let usersService: UsersService;
let user: User;
let userRepository: Repository<User>;

describe('UsersService', () => {
  beforeAll(async () => {
    usersService = Container.get(UsersService);
    userRepository = getRepository<User>(User);
  });

  it('all dependencies should be defined', () => {
    expect(usersService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('comparePassword', () => {
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

  describe('verifyUser', () => {
    beforeEach(async () => {
      user = await factory(User)().create();
    });

    it('should throw error if the hash is invalid', async () => {
      user.verifyHash = faker.datatype.uuid();

      jest.spyOn(usersService, 'showUserByHash')
        .mockRejectedValueOnce(new HashInvalidError);

      await expect(usersService.verifyUser(user.verifyHash))
        .rejects.toThrowError(HashInvalidError);
    });

    it('should throw error if the hash is expired', async () => {
      user.hashExpiresAt = faker.date.past();

      jest.spyOn(usersService, 'showUserByHash')
        .mockResolvedValueOnce(user);

      await expect(usersService.verifyUser(user.verifyHash))
        .rejects.toThrowError(HashExpiredError);
    });

    it('should verify the user email', async () => {
      jest.spyOn(usersService, 'showUserByHash')
        .mockResolvedValueOnce(user);
      jest.spyOn(userRepository, 'update')
        .mockResolvedValueOnce(mockUpdateResult);

      const userVerified = await usersService.verifyUser(user.verifyHash);
      expect(userVerified.verified).toBeTruthy();
      expect(userVerified.verifyHash).toBeNull();
      expect(userVerified.hashExpiresAt).toBeNull();
    });
  });
});
