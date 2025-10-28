import Redis from 'ioredis';
import configuration from '.';
import { logger } from './winston';

const redis = new Redis({
  host: configuration.REDIS_HOST,
  port: Number(configuration.REDIS_PORT),
  password: configuration.REDIS_PASSWORD,
});

redis.on('connect', () => logger.info('Connected to Redis'));
redis.on('error', (err) => logger.error('Redis Error:', err));

export default redis;
