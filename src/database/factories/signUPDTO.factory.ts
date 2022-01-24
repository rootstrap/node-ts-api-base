import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { SignUpDTO } from '@dto/signUpDTO';
import { Gender } from '@constants/users/attributes.constants';

define(SignUpDTO, (faker: typeof Faker) => {
  const signUPDTO = new SignUpDTO();
  signUPDTO.firstName = faker.name.firstName();
  signUPDTO.lastName = faker.name.lastName();
  signUPDTO.gender = faker.random.arrayElement(Object.values(Gender));
  signUPDTO.email = faker.internet.email(signUPDTO.firstName, signUPDTO.lastName);
  signUPDTO.password = faker.internet.password(8);

  return signUPDTO;
});
