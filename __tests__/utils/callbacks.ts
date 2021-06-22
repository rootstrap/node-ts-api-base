import connection from '@database/connection';
import { redisClient } from '@server';
import { useSeeding } from 'typeorm-seeding';

beforeAll(async () => {
  await connection.create();
  await useSeeding();
});

afterAll(async () => {
  await connection.close();
  await redisClient.quit();
});

beforeEach(async () => {
  await connection.clear();
});
