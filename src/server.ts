import 'reflect-metadata'; // this shim is required
import { PORT, TYPEORM_PORT, REDIS_PORT, TESTING_ENV, CI_ENV } from '@config';
import connection from '@database/connection';
import app from '@app';
import { createRedisClient } from '@clients/redis/redis.client';
import { createEmailClient } from '@clients/email/email.client';

const handleConnection = async () => {
  // run express application on given port
  if (!TESTING_ENV && !CI_ENV) {
    app.listen(PORT, () => {
      return console.log(
        `Server is listening on ${PORT}
Postgres database is listening on port ${TYPEORM_PORT}
Redis database is listening on port ${REDIS_PORT}`
      );
    });
  }
};

// Start redis server
export const redisClient = createRedisClient();

export const emailClient = createEmailClient();

connection.create(handleConnection);
