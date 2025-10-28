import Redis from 'ioredis';

class CacheService {
  private readonly redisClient: Redis;

  constructor(redisClient: Redis) {
    this.redisClient = redisClient;
  }

  public async getKeys(matchPattern: string, count: number): Promise<string[]> {
    const keys: string[] = [];
    const stream = this.redisClient.scanStream({ match: matchPattern, count });
    for await (const batch of stream) {
      keys.push(...batch);
    }
    return keys;
  }
}

export default CacheService;