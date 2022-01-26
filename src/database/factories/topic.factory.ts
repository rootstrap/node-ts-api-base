import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Topic } from '@entities/topic.entity';

define(Topic, (faker: typeof Faker) => {
  const name = faker.random.word();
  const image = faker.image.imageUrl();
  const topic = new Topic(name, image);

  return topic;
});
