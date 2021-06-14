import {
  JsonController,
  Body,
  Post,
  BodyParam,
  UnauthorizedError,
  BadRequestError,
  Res
} from 'routing-controllers';
import omit from 'lodash/omit';
import { Service } from 'typedi';
import { User } from '@entities/user.entity';
import { SessionService } from '@services/session.service';
import { Errors } from '@constants/errorMessages';

@JsonController('/auth')
@Service()
export class AuthController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('/signup')
  async signUp(@Body({ validate: false }) user: User, @Res() response: any) {
    try {
      const newUser = await this.sessionService.signUp(user);
      return response.send(omit(newUser, ['password']));
    } catch (error) {
      if (error?.message === Errors.MISSING_PARAMS) {
        throw new BadRequestError(Errors.MISSING_PARAMS);
      } else {
        throw new BadRequestError(error?.message);
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
    } catch (error) {
      switch (error?.message) {
        case Errors.MISSING_PARAMS:
          throw new BadRequestError(Errors.MISSING_PARAMS);
        default:
          throw new UnauthorizedError(Errors.INVALID_CREDENTIALS);
      }
    }
  }
}
