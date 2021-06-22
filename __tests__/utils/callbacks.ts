import connection from '@database/connection';
import { useSeeding } from 'typeorm-seeding';

beforeAll(async () => {
  await connection.create();
  await useSeeding();
});

afterAll(async () => {
  await connection.close();
});

beforeEach(async () => {
  await connection.clear();
});
