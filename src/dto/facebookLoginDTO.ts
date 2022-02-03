import { Gender } from '@constants/users/attributes.constants';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class FacebookLoginDTO {
  @MaxLength(40, { message: 'email should have a maximum length of $constraint1' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MaxLength(20, { message: 'first name should have a maximum length of $constraint1' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @MaxLength(20, { message: 'last name should have a maximum length of $constraint1' })
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
