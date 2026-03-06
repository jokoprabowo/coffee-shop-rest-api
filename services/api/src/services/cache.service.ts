import Redis from 'ioredis';

class CacheService {
  constructor(private readonly redisClient: Redis) {}

  public async set(key: string, value: string, expirationInSecond: number = 24 * 3600): Promise<void> {
    await this.redisClient.set(key, value, 'EX', expirationInSecond);
  }

  public async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  public async del(key: string): Promise<number> {
    return await this.redisClient.del(key);
  }

  public async disconnect(): Promise<void> {
    await this.redisClient.quit();
  }
}

export default CacheService;
