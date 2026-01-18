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
    await redis.quit();
  });

  describe('getKeys', () => {
    it('should collect keys from redis scanStream', async () => {
      const mockStream = {
        async *[Symbol.asyncIterator]() {
          yield ['key:1', 'key:2'];
          yield ['key:3'];
        },
      };

      Object.defineProperty(redis, 'scanStream', {
        value: jest.fn(() => mockStream),
      });

      const result = await cacheService.getKeys('key:*', 100);

      expect(redis.scanStream).toHaveBeenCalledWith({
        match: 'key:*',
        count: 100,
      });

      expect(result).toEqual(['key:1', 'key:2', 'key:3']);
    });

    it('should return empty array if stream yields no keys', async () => {
      const emptyStream = {
        async *[Symbol.asyncIterator]() {
        },
      };

      Object.defineProperty(redis, 'scanStream', {
        value: jest.fn(() => emptyStream),
      });

      const result = await cacheService.getKeys('empty:*', 50);

      expect(result).toEqual([]);
    });
  });
});
