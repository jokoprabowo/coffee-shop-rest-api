import { redis, pool } from '@project/shared';

jest.setTimeout(30000);

afterAll(async () => {
  await redis.quit();
  await pool.end();
});