import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { CreateTargetDTO } from '@dto/createTargetDTO';

define(CreateTargetDTO, (faker: typeof Faker) => {
  const latitude = faker.address.latitude();
  const longitude = faker.address.longitude();
  const createTargetDTO = new CreateTargetDTO(latitude, longitude);
  createTargetDTO.title = faker.random.word()+faker.random.word();
  createTargetDTO.radius = faker.random.number();

  return createTargetDTO;
});
