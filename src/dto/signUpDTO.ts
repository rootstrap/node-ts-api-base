import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BaseUserDTO } from './baseUserDTO';
import { Gender } from '@constants/users/attributes.constants';

export class SignUpDTO extends BaseUserDTO {
  @IsString() @IsNotEmpty()
  firstName!: string;

  @IsString() @IsNotEmpty()
  lastName!: string;

  @IsNotEmpty() @IsEnum( Gender )
  gender!: Gender;
}
