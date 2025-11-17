import redis from './src/config/redis';
import pool from './src/config/db';

jest.setTimeout(30000);

afterAll(async () => {
  await redis.quit();
  await pool.end();
});