import { Container } from 'typedi';
import { genSaltSync, hashSync } from 'bcrypt';
import { UsersService } from '@services/users.service';
import { factory } from 'typeorm-seeding';
import { User } from '@entities/user.entity';
import { getRepository, Repository } from 'typeorm';
import { mockUpdateResult } from '../utils/mocks';
import { HashInvalidError } from '@exception/users/hashinvalid.error';
import { HashExpiredError } from '@exception/users/hashexpired.error';

let usersService: UsersService;
let user: User;
let userRepository: Repository<User>;

describe('UsersService', () => {
  beforeAll(async () => {
    usersService = Container.get(UsersService);
  });

  it('all dependencies should be defined', () => {
    expect(usersService).toBeDefined();
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

    beforeAll( () => {
      usersService = Container.get(UsersService);
      userRepository = getRepository<User>(User);
    });

    it('should throw error if the hash is invalid', async () => {
      user.verifyHash = '11111111-2222-3333-4444-555555555555';

      jest.spyOn(usersService, 'showUserByHash')
        .mockRejectedValueOnce(new HashInvalidError);

      expect(usersService.verifyUser(user.verifyHash))
        .rejects.toThrowError(HashInvalidError);
    });

    it('should throw error if the hash is expired', async () => {
      user.hashExpiresAt = new Date();

      jest.spyOn(usersService, 'showUserByHash')
        .mockResolvedValueOnce(user);

      expect(usersService.verifyUser(user.verifyHash))
        .rejects.toThrowError(HashExpiredError);
    });

    it('should verify the user email', async () => {
      jest.spyOn(usersService, 'showUserByHash')
        .mockResolvedValueOnce(user);
      jest.spyOn(userRepository, 'update')
        .mockResolvedValueOnce(mockUpdateResult);

      const userVerified = await usersService.verifyUser(user.verifyHash);
      expect(userVerified).toHaveProperty('verified', true);
      expect(userVerified).toHaveProperty('verifyHash', null);
      expect(userVerified).toHaveProperty('hashExpiresAt', null);
    });
  });
});
