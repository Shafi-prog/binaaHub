import { NextRequest } from 'next/server';

// Simple in-memory cache for rate limiting (fallback when Redis is not available)
class SimpleCache {
  private cache = new Map<string, { count: number; reset: number }>();

  async get(key: string): Promise<{ count: number; reset: number } | null> {
    const now = Date.now();
    const entry = this.cache.get(key);
    
    if (!entry || now > entry.reset) {
      this.cache.delete(key);
      return null;
    }
    
    return entry;
  }

  async set(key: string, value: { count: number; reset: number }): Promise<void> {
    this.cache.set(key, value);
  }

  async increment(key: string, windowMs: number): Promise<number> {
    const now = Date.now();
    const existing = await this.get(key);
    
    if (!existing) {
      await this.set(key, { count: 1, reset: now + windowMs });
      return 1;
    }
    
    existing.count++;
    await this.set(key, existing);
    return existing.count;
  }
}

// Use simple cache instead of Redis to avoid Node.js API issues in client builds
const cache = new SimpleCache();

interface RateLimitResult {
  success: boolean;
  remaining: number;
  retryAfter?: number;
}

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (request: NextRequest) => string;
}

const defaultOptions: RateLimitOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // requests per window
  keyGenerator: (request) => (request as any).ip || 'unknown'
};

// Different rate limits for different endpoints
const rateLimitConfigs: Record<string, RateLimitOptions> = {
  '/api/auth/login': {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 login attempts per 15 minutes
    keyGenerator: (request) => `login:${(request as any).ip || 'unknown'}`
  },
  '/api/auth/register': {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 registration attempts per hour
    keyGenerator: (request) => `register:${(request as any).ip || 'unknown'}`
  },
  '/api/products': {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
    keyGenerator: (request) => `products:${(request as any).ip || 'unknown'}`
  },
  '/api/orders': {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 requests per minute
    keyGenerator: (request) => `orders:${(request as any).ip || 'unknown'}`
  },
  '/api/payments': {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 payment requests per minute
    keyGenerator: (request) => `payments:${(request as any).ip || 'unknown'}`
  }
};

export async function rateLimit(request: NextRequest): Promise<RateLimitResult> {
  const pathname = request.nextUrl.pathname;
  
  // Find the most specific rate limit config
  const config = Object.keys(rateLimitConfigs)
    .filter(path => pathname.startsWith(path))
    .sort((a, b) => b.length - a.length)[0];
  
  const options = config ? rateLimitConfigs[config] : defaultOptions;
  const identifier = (options.keyGenerator || defaultOptions.keyGenerator!)(request);
  
  try {
    const count = await cache.increment(`ratelimit:${identifier}`, options.windowMs);
    
    if (count > options.maxRequests) {
      const entry = await cache.get(`ratelimit:${identifier}`);
      return {
        success: false,
        remaining: 0,
        retryAfter: entry ? Math.ceil((entry.reset - Date.now()) / 1000) : Math.ceil(options.windowMs / 1000)
      };
    }

    return {
      success: true,
      remaining: Math.max(0, options.maxRequests - count)
    };
    
  } catch (error) {
    console.error('Rate limit error:', error);
    // Fail open - allow request if rate limiting fails
    return {
      success: true,
      remaining: options.maxRequests
    };
  }
}

// Simple middleware-compatible rate limiting
export async function checkRateLimit(
  req: NextRequest,
  limit: number = 100,
  windowMs: number = 60 * 1000 // 1 minute
): Promise<{ success: boolean; remaining: number; resetTime: number }> {
  // For middleware, use a simple approach
  const result = await rateLimit(req);
  
  return {
    success: result.success,
    remaining: result.remaining,
    resetTime: Math.floor((Date.now() + windowMs) / 1000)
  };
}

// Rate limit decorator for API routes
export function withRateLimit(options?: Partial<RateLimitOptions>) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (request: NextRequest, ...args: any[]) {
      const rateLimitResult = await rateLimit(request);
      
      if (!rateLimitResult.success) {
        return new Response(
          JSON.stringify({ 
            error: 'Rate limit exceeded',
            retryAfter: rateLimitResult.retryAfter 
          }),
          { 
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
              'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
              'X-RateLimit-Limit': (options?.maxRequests || defaultOptions.maxRequests).toString()
            }
          }
        );
      }
      
      const response = await originalMethod.apply(this, [request, ...args]);
      
      // Add rate limit headers to successful responses
      if (response instanceof Response) {
        response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
        response.headers.set('X-RateLimit-Limit', (options?.maxRequests || defaultOptions.maxRequests).toString());
      }
      
      return response;
    };
    
    return descriptor;
  };
}

// Helper function to check if IP is whitelisted
export function isWhitelisted(ip: string): boolean {
  const whitelist = process.env.RATE_LIMIT_WHITELIST?.split(',') || [];
  return whitelist.includes(ip);
}

// Helper function to get client IP
export function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return (request as any).ip || 'unknown';
}
