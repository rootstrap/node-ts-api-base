import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { FacebookLoginDTO } from '@dto/facebookLoginDTO';
import { Gender } from '@constants/users/attributes.constants';

define(FacebookLoginDTO, (faker: typeof Faker) => {
  const facebookLoginDTO = new FacebookLoginDTO();
  facebookLoginDTO.firstName = faker.name.firstName();
  facebookLoginDTO.lastName = faker.name.lastName();
  facebookLoginDTO.email = faker.internet.email(
    facebookLoginDTO.firstName,
    facebookLoginDTO.lastName
  );
  facebookLoginDTO.facebookID = faker.random.uuid();
  facebookLoginDTO.gender = faker.random.arrayElement(Object.values(Gender));

  return facebookLoginDTO;
});
