import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: string;
    [key: string]: any;
  };
}

export interface AuthOptions {
  required?: boolean;
  roles?: string[];
  permissions?: string[];
}

export function createAuthMiddleware(options: AuthOptions = {}) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    try {
      const authHeader = request.headers.get('authorization');
      const token = authHeader?.replace('Bearer ', '');

      if (!token) {
        if (options.required) {
          return NextResponse.json(
            { error: 'Authentication token required' },
            { status: 401 }
          );
        }
        return null; // Continue without authentication
      }

      try {
        const decoded = verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
        
        // Add user information to request
        (request as AuthenticatedRequest).user = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role || 'user',
          ...decoded,
        };

        // Check role requirements
        if (options.roles && options.roles.length > 0) {
          const userRole = decoded.role || 'user';
          if (!options.roles.includes(userRole)) {
            return NextResponse.json(
              { error: 'Insufficient permissions' },
              { status: 403 }
            );
          }
        }

        // Check permission requirements
        if (options.permissions && options.permissions.length > 0) {
          const userPermissions = decoded.permissions || [];
          const hasRequiredPermission = options.permissions.some(permission =>
            userPermissions.includes(permission)
          );
          
          if (!hasRequiredPermission) {
            return NextResponse.json(
              { error: 'Insufficient permissions' },
              { status: 403 }
            );
          }
        }

        return null; // Continue to next middleware/handler
      } catch (jwtError) {
        return NextResponse.json(
          { error: 'Invalid authentication token' },
          { status: 401 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Authentication middleware error' },
        { status: 500 }
      );
    }
  };
}

// Common auth configurations
export const authConfigs = {
  required: { required: true },
  optional: { required: false },
  adminOnly: { required: true, roles: ['admin'] },
  userOrAdmin: { required: true, roles: ['user', 'admin'] },
  vendorOnly: { required: true, roles: ['vendor'] },
};

export default createAuthMiddleware;
