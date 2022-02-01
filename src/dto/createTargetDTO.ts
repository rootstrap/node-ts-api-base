import { IsNotEmpty, IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateTargetDTO {
  constructor(latitude: string, longitude: string) {
    this.location = `${latitude},${longitude}`;
  }
  @MinLength(4, { message: 'title should have a minimum length of $constraint1' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Min(0, { message: 'radius must be greater than 0' })
  @IsNumber({}, { message: 'radius must be a number' })
  @IsNotEmpty()
  radius: number;

  @IsString()
  @IsNotEmpty()
  location: string;
}
