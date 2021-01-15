import {
  JsonController,
  Body,
  Post,
  BodyParam,
  UnauthorizedError,
  BadRequestError,
  Res
} from 'routing-controllers';
import { getRepository } from 'typeorm';
import * as _ from 'lodash';
import { User } from '@entities/user.entity';
import { UsersService } from '@services/users.service';

@JsonController('/auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  async signUp(@Body({ validate: false }) user: User, @Res() response: any) {
    let newUser;

    try {
      newUser = await getRepository(User).save(user);
    } catch (error) {
      throw new BadRequestError('Missing params on body');
    }
    return response.send(_.omit(newUser, ['password']));
  }

  @Post('/signin')
  async signIn(
    @BodyParam('email') email: string,
    @BodyParam('password') password: string
  ) {
    if (!this.usersService.givenCrentials(email, password)) {
      throw new BadRequestError('Missing params on body');
    }

    let user: User;
    try {
      user = await User.findOneOrFail({ where: { email } });
    } catch (error) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Check if encrypted password match
    if (!this.usersService.comparePassword(password, user.password)) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // user matches email + password, create a token
    const token = this.usersService.generateToken(user);
    user.password = this.usersService.hashPassword(user.password);

    return {
      token
    };
  }
}
