import { createClient, RedisClientType } from 'redis';
import { logger } from '../config/winston';
import config from '../config';

class CacheService {
  private readonly _client: RedisClientType;

  constructor() {
    this._client = createClient({
      socket: {
        host: config.REDIS_SERVER,
      },
    });

    this._client.on('error', (error) => {
      logger.error('Redis Error:', error);
    });
  }

  public async ensureConnected(): Promise<void> {
    if (!this._client.isOpen) {
      await this._client.connect();
    }
  }

  public async set(key: string, value: string, expirationInSecond: number = 24 * 3600): Promise<void> {
    await this.ensureConnected();
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  public async get(key: string): Promise<string | null> {
    await this.ensureConnected();
    return await this._client.get(key);
  }

  public async del(key: string): Promise<void> {
    await this.ensureConnected();
    await this._client.del(key);
  }

  public get client(): RedisClientType {
    return this._client;
  }
}

export default CacheService;
