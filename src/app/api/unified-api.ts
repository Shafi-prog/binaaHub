// Unified API Layer - Implementation
import { NextRequest, NextResponse } from 'next/server';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class APIResponseHelper {
  static success<T>(data: T, message?: string): APIResponse<T> {
    return {
      success: true,
      data,
      message
    };
  }

  static error(error: string, data?: any): APIResponse {
    return {
      success: false,
      data,
      error
    };
  }
}

// Export both as interface and as value
export const APIResponse = APIResponseHelper;

interface Route {
  path: string;
  method: string;
  handler: (req: NextRequest) => Promise<NextResponse>;
  middleware?: Array<(req: NextRequest) => Promise<NextRequest>>;
}

class ApiLayer {
  private routes: Route[] = [];

  // Placeholder API layer methods
  async get(path: string) {
    return { success: true, data: null };
  }

  async post(path: string, data: any) {
    return { success: true, data: null };
  }

  async put(path: string, data: any) {
    return { success: true, data: null };
  }

  async delete(path: string) {
    return { success: true, data: null };
  }

  registerRoute(route: Route) {
    this.routes.push(route);
  }

  async processRequest(request: NextRequest): Promise<NextResponse> {
    // Simple request processing
    const url = new URL(request.url);
    const route = this.routes.find(r => r.path === url.pathname && r.method === request.method);
    
    if (route) {
      return await route.handler(request);
    }
    
    return NextResponse.json({ error: 'Route not found' }, { status: 404 });
  }
}

export const apiLayer = new ApiLayer();

export const createHandler = (handler: Function) => {
  return async (req: Request) => {
    try {
      return await handler(req);
    } catch (error) {
      return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
  };
};
