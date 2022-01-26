import { Seeder, Factory } from 'typeorm-seeding';
import { Topic } from '@entities/topic.entity';

export default class implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(Topic)().createMany(10);
  }
}
