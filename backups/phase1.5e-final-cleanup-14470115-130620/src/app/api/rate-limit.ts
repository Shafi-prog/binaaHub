// Rate limiting middleware for API requests
import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  message?: string;
}

export function rateLimitMiddleware(config: RateLimitConfig) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                 request.headers.get('x-real-ip') || 
                 'unknown';
    const key = `${ip}:${request.nextUrl.pathname}`;
    const now = Date.now();
    
    // Clean up expired entries
    if (rateLimitStore[key] && now > rateLimitStore[key].resetTime) {
      delete rateLimitStore[key];
    }
    
    // Initialize or update rate limit for this key
    if (!rateLimitStore[key]) {
      rateLimitStore[key] = {
        count: 1,
        resetTime: now + config.windowMs,
      };
    } else {
      rateLimitStore[key].count++;
    }
    
    // Check if rate limit exceeded
    if (rateLimitStore[key].count > config.maxRequests) {
      return NextResponse.json(
        {
          error: config.message || 'Rate limit exceeded',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil((rateLimitStore[key].resetTime - now) / 1000),
        },
        { status: 429 }
      );
    }
    
    return null; // Allow request to continue
  };
}

// Predefined rate limit configurations
export const rateLimitConfigs = {
  // Standard API endpoints
  api: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many API requests. Please try again later.',
  },
  
  // Authentication endpoints
  auth: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many authentication attempts. Please try again later.',
  },
  
  // File upload endpoints
  upload: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many upload requests. Please try again later.',
  },
  
  // Public endpoints
  public: {
    maxRequests: 200,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many requests. Please try again later.',
  },
};
