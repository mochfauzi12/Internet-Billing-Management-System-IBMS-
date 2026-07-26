import { ICacheService } from '@ibms/core';
import { KVNamespace } from '@cloudflare/workers-types';

export class KVCacheService implements ICacheService {
  constructor(private kv: KVNamespace) {}

  async get<T>(key: string): Promise<T | null> {
    const val = await this.kv.get(key, 'json');
    return val as T | null;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    await this.kv.put(key, JSON.stringify(value), {
      expirationTtl: ttlSeconds ?? 300, // default 5 min
    });
  }

  async delete(key: string): Promise<void> {
    await this.kv.delete(key);
  }
}
