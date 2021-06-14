import {
  JsonController,
  Body,
  Post,
  BodyParam,
  UnauthorizedError,
  BadRequestError,
  Req,
  Res,
  Authorized
} from 'routing-controllers';
import * as _ from 'lodash';
import { Service } from 'typedi';
import { User } from '@entities/user.entity';
import { SessionService } from '@services/session.service';
import { Errors } from '@constants/errorMessages';
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
      return response.send(_.omit(newUser, ['password']));
    } catch (error: any) {
      if (error?.message === Errors.MISSING_PARAMS) {
        throw new BadRequestError(Errors.MISSING_PARAMS);
      }
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
    } catch (error: any) {
      const errorMessage = error?.message;
      switch (errorMessage) {
        case Errors.MISSING_PARAMS:
          throw new BadRequestError(errorMessage);
        default:
          throw new UnauthorizedError(errorMessage);
      }
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
      throw new BadRequestError(error?.message);
    }
  }
}
