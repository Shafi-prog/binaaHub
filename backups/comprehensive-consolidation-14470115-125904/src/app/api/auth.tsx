// Authentication middleware for API requests
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export async function authMiddleware(request: NextRequest): Promise<NextResponse | null> {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Add user info to request
    (request as AuthenticatedRequest).user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    return null; // Allow request to continue
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}

export async function requireRole(request: AuthenticatedRequest, requiredRole: string): Promise<NextResponse | null> {
  const user = request.user;
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  if (user.role !== requiredRole && user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    );
  }

  return null;
}
