// Request validation middleware for API requests
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export interface ValidationConfig {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}

export function validationMiddleware(config: ValidationConfig) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    try {
      // Validate request body
      if (config.body) {
        const contentType = request.headers.get('content-type') || '';
        
        if (contentType.includes('application/json')) {
          const body = await request.json();
          const result = config.body.safeParse(body);
          
          if (!result.success) {
            return NextResponse.json(
              {
                error: 'Invalid request body',
                code: 'VALIDATION_ERROR',
                details: result.error.errors,
              },
              { status: 400 }
            );
          }
        }
      }
      
      // Validate query parameters
      if (config.query) {
        const { searchParams } = new URL(request.url);
        const queryObj = Object.fromEntries(searchParams);
        const result = config.query.safeParse(queryObj);
        
        if (!result.success) {
          return NextResponse.json(
            {
              error: 'Invalid query parameters',
              code: 'VALIDATION_ERROR',
              details: result.error.errors,
            },
            { status: 400 }
          );
        }
      }
      
      return null; // Allow request to continue
    } catch (error) {
      return NextResponse.json(
        {
          error: 'Request validation failed',
          code: 'VALIDATION_ERROR',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 400 }
      );
    }
  };
}

// Common validation schemas
export const commonSchemas = {
  // Pagination
  pagination: z.object({
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  }),
  
  // Search
  search: z.object({
    query: z.string().optional(),
    category: z.string().optional(),
    sort: z.enum(['name', 'price', 'date', 'rating']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
  }),
  
  // User creation
  createUser: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().optional(),
  }),
  
  // Product creation
  createProduct: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    price: z.number().positive(),
    categoryId: z.string().uuid(),
    storeId: z.string().uuid(),
    sku: z.string().optional(),
    quantity: z.number().min(0).optional(),
  }),
  
  // Order creation
  createOrder: z.object({
    items: z.array(z.object({
      productId: z.string().uuid(),
      quantity: z.number().positive(),
    })),
    shippingAddress: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
      country: z.string(),
    }),
  }),
};
