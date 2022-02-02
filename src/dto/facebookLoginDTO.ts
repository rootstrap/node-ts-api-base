import { Gender } from '@constants/users/attributes.constants';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class FacebookLoginDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  facebookID: string

  @IsEnum( Gender )
  @IsNotEmpty()
  gender: Gender;
}
