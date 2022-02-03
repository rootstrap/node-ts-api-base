/* eslint-disable max-len */
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
import { UserNotFoundError } from '@exception/users/user-not-found.error';

let usersService: UsersService;
let user: User;
let userRepository: Repository<User>;

describe('UsersService', () => {
  beforeAll( () => {
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

  describe('getUserByFBIDOrEmail', () => {
    beforeAll(async () => {
      user = await factory(User)().make();
      user.facebookID = faker.datatype.uuid();
    });

    it('should return the user', async () => {
      jest.spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(user);

      const userLogged = await usersService.getUserByFBIDOrEmail(
        user.facebookID,
        user.email
      );
      expect(userLogged.facebookID).toBe(user.facebookID);
      expect(userLogged.email).toBe(user.email);
    });

    it('should not find the user returning UserNotFoundError', async () => {
      jest.spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(null);

      await expect(usersService.getUserByFBIDOrEmail(
        user.facebookID,
        user.email
      )).rejects.toThrowError(UserNotFoundError);
    });
  });

  describe('findOrCreateUserFacebook', () => {
    beforeEach( async () => {
      user = await factory(User)().make();
      user.facebookID = faker.datatype.uuid();
    });

    it('should return the user if previously authenticated with FB', async () => {
      jest.spyOn(usersService, 'getUserByFBIDOrEmail')
        .mockResolvedValueOnce(user);

      const userResponse = await usersService.findOrCreateUserFacebook(user);
      expect(userResponse).toBe(user);
    });

    it('should return the user if previously authenticated with Email', async () => {
      const _user = await factory(User)().make( user );
      user.facebookID = null;
      jest.spyOn(usersService, 'getUserByFBIDOrEmail')
        .mockResolvedValueOnce(user);
      jest.spyOn(userRepository, 'save')
        .mockResolvedValueOnce(_user);

      const userResponse = await usersService.findOrCreateUserFacebook(_user);
      expect(userResponse).toBe(_user);
    });

    it('should return the user if it was not previously created', async () => {
      jest.spyOn(usersService, 'getUserByFBIDOrEmail')
        .mockRejectedValueOnce(new UserNotFoundError());
      jest.spyOn(userRepository, 'save')
        .mockResolvedValueOnce(user);

      const userResponse = await usersService.findOrCreateUserFacebook(user);
      expect(userResponse).toBe(user);
    });
  });
});
