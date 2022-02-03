import {
  JsonController,
  Body,
  Post,
  Req,
  Authorized,
  Res
} from 'routing-controllers';
import omit from 'lodash/omit';
import { Service } from 'typedi';
import { User } from '@entities/user.entity';
import { SessionService } from '@services/session.service';
import { Request, Response } from 'express';
import { EntityMapper } from '@clients/mapper/entityMapper.service';
import { BaseUserDTO } from '@dto/baseUserDTO';
import { SignUpDTO } from '@dto/signUpDTO';
import { LogoutDTO } from '@dto/logoutDTO';
import { IEmail } from 'src/interfaces/email/email.interface';
import { EmailService } from '@services/email.service';
import { FacebookLoginDTO } from '@dto/facebookLoginDTO';

@JsonController('/auth')
@Service()
export class AuthController {
  constructor(private readonly sessionService: SessionService) { }

  @Post('/signup')
  async signUp(
    @Body({ validate: true }) user: SignUpDTO,
    @Req() request: Request,
    @Res() response: Response
  ) {
    const newUser = await this.sessionService.signUp(
      EntityMapper.mapTo(User, user)
    );
    const emailData: IEmail = {
      from: process.env.EMAIL_SENDER,
      to: newUser.email,
      subject: 'Email Verification',
      text: `Hello ${newUser.firstName} click on the link below to verify your email.
      <a href="${request.hostname}/api/v1/users/verify?key=${newUser.verifyHash}">
      Verify my email</a>
      `
    };
    await EmailService.sendEmail( emailData );
    return response.send(omit(newUser, ['password']));
  }

  @Post('/signin')
  async signIn(@Body({ validate: true }) signInDTO: BaseUserDTO) {
    const token = await this.sessionService.signIn(signInDTO);
    return { token };
  }

  @Post('/facebook')
  async authenticateFacebook(
    @Body() facebookData: FacebookLoginDTO
  ) {
    const user = EntityMapper.mapTo(User, facebookData);
    return this.sessionService.authenticateFacebook(user);
  }

  @Authorized()
  @Post('/logout')
  async logOut(
    @Body({ validate: true }) logOutDTO: LogoutDTO,
    @Req() request: Request
  ) {
    const token = request.headers['authorization'] as string;
    const email = logOutDTO.email;
    const tokenAddToBlacklist: number = await this.sessionService.logOut({
      email,
      token
    });
    return {
      logout: !!tokenAddToBlacklist
    };
  }
}
