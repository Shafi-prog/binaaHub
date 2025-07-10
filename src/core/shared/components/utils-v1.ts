// @ts-nocheck
// Common utility functions for API key management
import { ApiKeyType } from './api-key-constants'

export function getApiKeyTypeFromPathname(pathname: string): ApiKeyType {
  // Extract API key type from pathname
  // Example: /api-keys/publishable -> 'publishable'
  const segments = pathname.split('/');
  const keyTypeIndex = segments.indexOf('api-keys') + 1;
  
  if (keyTypeIndex > 0 && keyTypeIndex < segments.length) {
    const typeString = segments[keyTypeIndex];
    if (typeString === 'publishable') {
      return ApiKeyType.PUBLISHABLE;
    } else if (typeString === 'secret') {
      return ApiKeyType.SECRET;
    }
  }
  
  return ApiKeyType.SECRET; // default type
}

export function getApiKeyStatusProps(revokedAt: Date | null, t: any) {
  const isRevoked = revokedAt !== null
  return {
    label: isRevoked ? 'Revoked' : 'Active',
    color: isRevoked ? ('red' as const) : ('green' as const)
  }
}

export function getApiKeyTypeProps(type: string, t: any) {
  return {
    label: type === 'publishable' ? 'Publishable' : 'Secret',
    color: type === 'publishable' ? ('blue' as const) : ('purple' as const)
  }
}

export function prettifyRedactedToken(token: string) {
  if (!token || token.length < 6) return token
  const start = token.substring(0, 3)
  const end = token.substring(token.length - 2)
  return `${start}${'•'.repeat(token.length - 5)}${end}`
}


