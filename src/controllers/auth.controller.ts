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
import { createJWT } from '@services/jwt.service';

@JsonController('/auth')
export class AuthController {
  @Post('/signup')
  async signUp(@Body({ validate: false }) user: User, @Res() response: any) {
    const newUser = await getRepository(User).save(user);
    return response.send(_.omit(newUser, ['password']));
  }

  @Post('/signin')
  async signIn(
    @BodyParam('email') email: string,
    @BodyParam('password') password: string
  ) {
    if (!email || !password) {
      throw new BadRequestError('Missing params on body');
    }

    let user: User;
    try {
      user = await User.findOneOrFail({ where: { email } });
    } catch (error) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Check if encrypted password match
    if (!user.comparePassword(password)) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // user matches email + password, create a token
    const token = createJWT(user);
    return {
      token
    };
  }
}
