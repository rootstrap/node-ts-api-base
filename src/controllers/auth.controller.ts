import {
  JsonController,
  Body,
  Post,
  BodyParam,
  BadRequestError,
  Req,
  Authorized,
  Res
} from 'routing-controllers';
import omit from 'lodash/omit';
import { Service } from 'typedi';
import { User } from '@entities/user.entity';
import { SessionService } from '@services/session.service';
import { Errors, ErrorsMessages } from '@constants/errorMessages';
import { Request, Response } from 'express';

@JsonController('/auth')
@Service()
export class AuthController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('/signup')
  async signUp(
    @Body({ validate: false }) user: User,
    @Res() response: Response
  ) {
    try {
      const newUser = await this.sessionService.signUp(user);
      return response.send(omit(newUser, ['password']));
    } catch (error) {
      throw Errors[error.message] || Errors[ErrorsMessages.DEFAULT];
    }
  }

  @Post('/signin')
  async signIn(
    @BodyParam('email') email: string,
    @BodyParam('password') password: string
  ) {
    try {
      const token = await this.sessionService.signIn({ email, password });
      return { token };
    } catch (error) {
      throw Errors[error.message] || Errors[ErrorsMessages.DEFAULT];
    }
  }

  @Authorized()
  @Post('/logout')
  async logOut(@BodyParam('email') email: string, @Req() request: Request) {
    try {
      const token = request.headers['authorization'] as string;
      const tokenAddToBlacklist: number = await this.sessionService.logOut({
        email,
        token
      });
      return {
        logout: !!tokenAddToBlacklist
      };
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }
}
