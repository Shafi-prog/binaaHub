// Error handling middleware for API requests
import { NextRequest, NextResponse } from 'next/server';

export interface APIError {
  code: string;
  message: string;
  details?: any;
}

export class APIErrorHandler {
  static handleError(error: any): NextResponse {
    console.error('API Error:', error);

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        {
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: error.errors || error.message,
        },
        { status: 400 }
      );
    }

    if (error.name === 'NotFoundError') {
      return NextResponse.json(
        {
          error: 'Resource not found',
          code: 'NOT_FOUND',
          details: error.message,
        },
        { status: 404 }
      );
    }

    if (error.name === 'UnauthorizedError') {
      return NextResponse.json(
        {
          error: 'Unauthorized access',
          code: 'UNAUTHORIZED',
          details: error.message,
        },
        { status: 401 }
      );
    }

    if (error.name === 'ForbiddenError') {
      return NextResponse.json(
        {
          error: 'Forbidden access',
          code: 'FORBIDDEN',
          details: error.message,
        },
        { status: 403 }
      );
    }

    // Default server error
    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }

  static createError(code: string, message: string, details?: any): APIError {
    return { code, message, details };
  }
}

export function withErrorHandler(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(request);
    } catch (error) {
      return APIErrorHandler.handleError(error);
    }
  };
}
