import {
  JsonController,
  Body,
  Post,
  BodyParam,
  UnauthorizedError,
  BadRequestError,
  Res,
  Get,
  Param,
  OnUndefined
} from 'routing-controllers';
import { getRepository } from 'typeorm';
import * as _ from 'lodash';
import { User } from '@entities/user.entity';
import { createJWT } from '@services/jwt.service';

@JsonController('/auth')
export class AuthController {
  @Post('/signup')
  async signUp(@Body({ validate: false }) user: User, @Res() response: any) {
    let newUser: User;

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
    if (!email || !password) {
      throw new BadRequestError('Missing params on body');
    }

    let user: User;
    try {
      user = await getRepository(User).findOneOrFail({ where: { email } });
    } catch (error) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Check if encrypted password match
    if (!user.comparePassword(password)) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Check if user is confirmed
    if (!user.isConfirmed()) {
      throw new UnauthorizedError('Confirm your email before continuing');
    }

    // user matches email + password, create a token
    const token = await createJWT(user);
    return {
      token
    };
  }

  @Get('/confirm/:token')
  @OnUndefined(201)
  async confirm(@Param('token') token: string) {
    console.log('token: ', token);
    const user = await getRepository(User).findOne({
      where: { confirmationToken: token }
    });

    if (user) {
      user.confirmedAt = new Date();
      await user.save();
    }
  }
}
