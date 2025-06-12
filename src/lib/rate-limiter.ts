import { NextRequest, NextResponse } from 'next/server';
import { CacheService } from './cache';

interface RateLimitConfig {
  requests: number;
  window: number; // seconds
  skipSuccessfulRequests?: boolean;
}

export class RateLimiter {
  static async check(
    identifier: string,
    config: RateLimitConfig
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = `rate_limit:${identifier}`;
    const now = Date.now();
    const windowStart = now - (config.window * 1000);

    try {
      // Get current requests in window
      const requests = await CacheService.get<number[]>(key) || [];
      
      // Filter requests within current window
      const validRequests = requests.filter(time => time > windowStart);
      
      // Check if limit exceeded
      const allowed = validRequests.length < config.requests;
      
      if (allowed) {
        // Add current request
        validRequests.push(now);
        await CacheService.set(key, validRequests, config.window);
      }

      return {
        allowed,
        remaining: Math.max(0, config.requests - validRequests.length),
        resetTime: windowStart + (config.window * 1000)
      };
    } catch (error) {
      console.error('Rate limit check error:', error);
      // Allow request if rate limiter fails
      return { allowed: true, remaining: config.requests, resetTime: now };
    }
  }
  // Different rate limits for different endpoints
  static async checkAPI(req: NextRequest, config?: RateLimitConfig) {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const identifier = `${ip}:${userAgent.slice(0, 50)}`;

    const defaultConfig: RateLimitConfig = {
      requests: 100,
      window: 3600, // 1 hour
    };

    return this.check(identifier, config || defaultConfig);  }

  static async checkPayment(req: NextRequest) {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
    return this.check(`payment:${ip}`, {
      requests: 10,
      window: 3600, // 10 payment attempts per hour
    });
  }

  static async checkLogin(req: NextRequest) {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
    return this.check(`login:${ip}`, {
      requests: 20,
      window: 900, // 20 login attempts per 15 minutes
    });
  }
}

// Middleware helper
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  config?: RateLimitConfig
) {
  return async (req: NextRequest) => {
    const result = await RateLimiter.checkAPI(req, config);
    
    if (!result.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          resetTime: result.resetTime 
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.resetTime.toString(),
          }
        }
      );
    }

    const response = await handler(req);
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', result.resetTime.toString());
    
    return response;
  };
}
