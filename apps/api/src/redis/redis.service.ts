import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private readonly inMemoryCache = new Map<string, { val: string; expiresAt: number }>();

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    try {
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
        retryStrategy: () => null, // don't hang if redis is down in dev/test
      });

      this.client.on('error', (err) => {
        this.logger.warn(`Redis connection unavailable: ${err.message}. Using in-memory fallback cache.`);
        this.client = null;
      });

      this.client.on('connect', () => {
        this.logger.log('Connected to Redis successfully');
      });
    } catch (err: any) {
      this.logger.warn(`Redis initialization skipped: ${err.message}. Using fallback.`);
      this.client = null;
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.client) {
      try {
        return await this.client.get(key);
      } catch {
        // Fall back to memory
      }
    }
    const item = this.inMemoryCache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.inMemoryCache.delete(key);
      return null;
    }
    return item.val;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (this.client) {
      try {
        if (ttlSeconds) {
          await this.client.set(key, value, 'EX', ttlSeconds);
        } else {
          await this.client.set(key, value);
        }
        return;
      } catch {
        // Fall back to memory
      }
    }
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : Number.MAX_SAFE_INTEGER;
    this.inMemoryCache.set(key, { val: value, expiresAt });
  }

  async del(key: string): Promise<void> {
    if (this.client) {
      try {
        await this.client.del(key);
      } catch {
        // ignore
      }
    }
    this.inMemoryCache.delete(key);
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
    }
  }
}
