import { Gender } from '@constants/users/attributes.constants';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class FacebookLoginDTO {
  @MaxLength(40, { message: 'email cannot have more than $constraint1 characters' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MaxLength(20, { message: 'first name cannot have more than $constraint1 characters' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @MaxLength(20, { message: 'last name cannot have more than $constraint1 characters' })
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
