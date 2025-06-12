// Simple in-memory cache implementation
class InMemoryCache {
  private cache = new Map<string, { value: any; expires: number }>();

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  set(key: string, value: any, ttl: number = 3600): void {
    const expires = Date.now() + (ttl * 1000);
    this.cache.set(key, { value, expires });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

const cache = new InMemoryCache();

export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    try {
      return cache.get<T>(key);
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }
  static async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    try {
      cache.set(key, value, ttl);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  static async del(key: string): Promise<void> {
    try {
      cache.delete(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  // Cache patterns for your app
  static userStatsKey(userId: string) {
    return `user:stats:${userId}`;
  }

  static storeStatsKey(storeId: string) {
    return `store:stats:${storeId}`;
  }

  static projectKey(projectId: string) {
    return `project:${projectId}`;
  }
}
