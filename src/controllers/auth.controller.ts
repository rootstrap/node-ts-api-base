import { Response } from 'express';
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
import { User } from '@entities/user.entity';
import { createJWT } from '@services/jwt.service';

@JsonController('/auth')
export class AuthController {
  @Post('/signup')
  async signUp(@Body({ validate: false }) user: User) {
    let newUser;

    try {
      newUser = await getRepository(User).save(user);
    } catch (error) {
      throw new BadRequestError('Missing params on body');
    }
    return newUser.publicFields();
  }

  @Post('/signin')
  async signIn(
    @BodyParam('email') email: string,
    @BodyParam('password') password: string,
    @Res() response: Response
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
    const token = await createJWT(user);
    response.set('access-token', token);

    return user.publicFields();
  }
}
