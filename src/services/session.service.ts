import { Service } from 'typedi';
import { getRepository } from 'typeorm';
import { User } from '@entities/user.entity';
import { UsersService } from '@services/users.service';
import { RedisService } from '@services/redis.service';
import { Errors } from '@constants/errorMessages';
import { AuthInterface } from '@interfaces';

@Service()
export class SessionService {
  constructor(
    private readonly userService: UsersService,
    private readonly redisService: RedisService
  ) {}

  private readonly userRepository = getRepository<User>(User);

  async signUp(user: User) {
    let newUser: User;

    try {
      newUser = await this.userRepository.save(user);
    } catch (error) {
      throw new Error(Errors.MISSING_PARAMS);
    }

    return newUser;
  }

  async signIn(input: AuthInterface.ISignInInput) {
    const { email, password } = input;
    if (!this.userService.givenCredentials({ email, password })) {
      throw new Error(Errors.MISSING_PARAMS);
    }

    let user: User;
    try {
      user = await User.findOneOrFail({ where: { email } });
    } catch (error) {
      throw new Error(Errors.INVALID_CREDENTIALS);
    }

    user.password = this.userService.hashPassword(user.password);
    if (
      !this.userService.comparePassword({
        password,
        userPassword: user.password
      })
    ) {
      throw new Error(Errors.INVALID_CREDENTIALS);
    }

    const token = this.userService.generateToken(user);
    return token;
  }

  logOut(input: AuthInterface.ITokenToBlacklistInput): Promise<number> {
    try {
      const tokenAddedToBlacklist =
        this.redisService.addTokenToBlacklist(input);
      if (!tokenAddedToBlacklist) {
        throw new Error(Errors.REDIS_ERROR_SET_TOKEN);
      }
      return tokenAddedToBlacklist;
    } catch (error) {
      throw new Error(Errors.REDIS_ERROR);
    }
  }
}
