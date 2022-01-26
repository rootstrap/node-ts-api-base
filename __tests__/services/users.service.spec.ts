import { Container } from 'typedi';
import { genSaltSync, hashSync } from 'bcrypt';
import { UsersService } from '@services/users.service';
import { factory } from 'typeorm-seeding';
import { User } from '@entities/user.entity';
import { ErrorsMessages } from '@constants/errorMessages';
import { getRepository, Repository } from 'typeorm';
import { mockUpdateResult } from '../utils/mocks';

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

    beforeAll(async () => {
      usersService = Container.get(UsersService);
      userRepository = getRepository<User>(User);
    });

    it('should throw error if the hash is invalid', async () => {
      const verifyHash = '11111111-2222-3333-4444-555555555555';

      jest.spyOn(userRepository, 'findOne')
        .mockRejectedValueOnce(new Error(ErrorsMessages.HASH_NOT_VALID));

      expect(usersService.verifyUser(verifyHash)).rejects.toThrowError(Error);
    });

    it('should throw error if the hash is expired', async () => {
      const verifyHash = '11111111-2222-3333-4444-555555555555';

      jest.spyOn(userRepository, 'findOne')
        .mockRejectedValueOnce(new Error(ErrorsMessages.HASH_EXPIRED));

      expect(usersService.verifyUser(verifyHash)).rejects.toThrowError(Error);
    });

    it('should verify the user email', async () => {
      user = await factory(User)().make();
      jest.spyOn(userRepository, 'findOne')
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
