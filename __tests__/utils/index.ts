import { User } from '@entities/user.entity';
import * as Faker from 'faker'
import { factory, useSeeding } from 'typeorm-seeding';

export const API = '/api/v1';

export const mockUserFields = () => {
  return {
    firstName: Faker.name.firstName(),
    lastName: Faker.name.lastName(),
    email: Faker.internet.email(),
    password: Faker.internet.password(8)
  }
};
