import { CacheService } from '../../src/services';
import type Redis from 'ioredis';
import redisMock from 'ioredis-mock';

describe('CacheService', () => {
  let cacheService: CacheService;
  let redis: Redis;

  beforeEach(() => {
    redis = new (redisMock as unknown as typeof Redis);
    cacheService = new CacheService(redis);
  });

  afterEach(async () => {
    await redis.flushall();
    await redis.quit();
  });

  describe('set', () => {
    it('should set value without expiry time', async () => {
      await cacheService.set('key:1', 'value:1');

      const result = await redis.get('key:1');
      expect(result).toEqual('value:1');
    });

    it('should set value with expiry time', async () => {
      await cacheService.set('key:2', 'value:2', 600);

      const result = await redis.get('key:2');
      expect(result).toEqual('value:2');
    });
  });

  describe('get', () => {
    it('should return value if key exists', async () => {
      await redis.set('key:3', 'value:3');

      const result = await cacheService.get('key:3');
      expect(result).toEqual('value:3');
    });

    it('should return null if key does not exist`', async () => {
      const result = await cacheService.get('missing-key');
      expect(result).toBeNull();
    });
  });

  describe('del', () => {
    it('should delete existing key', async () => {
      await redis.set('key4', 'value4');

      const deleted = await cacheService.del('key4');
      const value = await redis.get('key4');

      expect(deleted).toBe(1);
      expect(value).toBeNull();
    });

    it('should return 0 if key does not exist', async () => {
      const deleted = await cacheService.del('unknown-key');
      expect(deleted).toBe(0);
    });
  });
});
