import connection from '@database/connection';
import { useSeeding } from 'typeorm-seeding';

beforeAll(async done => {
  await connection.create();
  await useSeeding();
  done();
});

afterAll(async done => {
  await connection.close();
  done();
});

beforeEach(async done => {
  await connection.clear();
  done();
});
