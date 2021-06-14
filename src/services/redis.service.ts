import { REDIS_PASSWORD } from '@config';
import { createClient, RedisClient } from 'redis';
import { Service } from 'typedi';

@Service()
export class RedisService {
  static createRedisClient(): RedisClient {
    const redisClient = createClient({
      password: REDIS_PASSWORD as string
    });
    redisClient.on('connect', connectObj => {
      console.info(`Connected to redis server: ${connectObj}`);
    });
    redisClient.on('error', error => {
      console.error(`Redis error: ${error}`);
    });

    return redisClient;
  }
}
