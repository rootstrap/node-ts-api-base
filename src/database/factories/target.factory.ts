import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Target } from '@entities/target.entity';

define(Target, (faker: typeof Faker) => {
  const latitude = faker.address.latitude();
  const longitude = faker.address.longitude();
  const target = new Target(latitude, longitude);
  target.title = faker.random.word();
  target.radius = faker.random.number();

  return target;
});
