import { REDIS_PASSWORD, REDIS_HOST } from '@config';
import { createClient, RedisClient } from 'redis';

export const createRedisClient = (): RedisClient => {
  const redisClient = createClient({
    host: REDIS_HOST as string,
    password: REDIS_PASSWORD as string
  });
  redisClient.on('error', error => {
    console.error(`Redis error: ${error} \n
      Please check your Redis instance.`);
    process.exit(1);
  });

  return redisClient;
};
