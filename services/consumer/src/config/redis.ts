import Redis from 'ioredis';
import config from '.';
import { logger } from '@project/shared';

const redis = new Redis({
  host: config.REDIS_HOST,
  port: Number(config.REDIS_PORT),
  password: config.REDIS_PASSWORD,
});

redis.on('connect', () => logger.info('Connected to Redis'));
redis.on('error', (err) => logger.error('Redis Error:', err));

export default redis;
