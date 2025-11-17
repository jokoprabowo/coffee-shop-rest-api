import { redis } from '@project/shared';

class CacheService {

  public async set(key: string, value: string, expirationInSecond: number = 24 * 3600): Promise<void> {
    await redis.set(key, value, 'EX', expirationInSecond);
  }

  public async get(key: string): Promise<string | null> {
    return await redis.get(key);
  }

  public async del(key: string): Promise<void> {
    await redis.del(key);
  }

  public async disconnect(): Promise<void> {
    await redis.quit();
  }
}

export default CacheService;
