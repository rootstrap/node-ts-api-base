import { IsNotEmpty, IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateTargetDTO {
  constructor(latitude: string, longitude: string) {
    this.location = `${latitude},${longitude}`;
  }
  @IsString()
  @IsNotEmpty()
  @MinLength(4, { message: 'title should have a minimum length of $constraint1' })
  title: string;

  @IsNumber({}, { message: 'radius must be a number' })
  @IsNotEmpty()
  @Min(0, { message: 'radius must be greater than 0' })
  radius: number;

  @IsString()
  @IsNotEmpty()
  location: string;
}
