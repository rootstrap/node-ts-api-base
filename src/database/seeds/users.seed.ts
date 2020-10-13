import { Seeder, Factory } from 'typeorm-seeding';
import { User } from '@entities/user.entity';

export default class implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(User)().createMany(10);
  }
}
