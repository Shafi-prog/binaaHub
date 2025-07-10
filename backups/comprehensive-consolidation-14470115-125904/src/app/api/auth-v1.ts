import { NextRequest } from 'next/server';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    name: string;
    role?: string;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export function authenticateRequest(request: NextRequest): AuthenticatedRequest {
  // Basic authentication middleware
  // In a real app, you'd verify JWT tokens, sessions, etc.
  const authHeader = request.headers.get('authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Mock user for development
    (request as AuthenticatedRequest).user = {
      id: '1',
      email: 'user@example.com',
      name: 'Test User',
      role: 'user'
    };
  }
  
  return request as AuthenticatedRequest;
}

export function requireAuth(request: AuthenticatedRequest): AuthUser {
  if (!request.user) {
    throw new Error('Authentication required');
  }
  return request.user;
}