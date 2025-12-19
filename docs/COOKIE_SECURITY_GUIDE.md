# Cookie Security Implementation Guide

## Overview
This document describes the cookie security implementation in the binaaHub application and provides guidance for proper secure cookie handling.

## Current Implementation

### Client-Side Cookie Clearing
Located in: `src/core/shared/services/logout.ts`

The `clearAllCookies()` function clears cookies from the client side with the following security considerations:

```typescript
// Applies SameSite=Strict and Secure flags when clearing
const secureFlags = 'SameSite=Strict; Secure';
document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; ${secureFlags}`;
```

### Important Limitations

**HttpOnly Cookies Cannot Be Managed Client-Side:**
- HttpOnly cookies can only be set, modified, or deleted by the server
- Client-side JavaScript cannot access or clear HttpOnly cookies via `document.cookie`
- This is a security feature to prevent XSS attacks from stealing session cookies

## Server-Side Cookie Security Requirements

### For API Routes and Server Components

When setting cookies from server-side code (API routes, server actions, middleware), **always** include these security attributes:

```typescript
// Example: Setting a secure cookie from an API route
export async function POST(request: Request) {
  const response = new Response();
  
  response.headers.set('Set-Cookie', [
    'session_token=value',
    'HttpOnly',           // Prevents client-side JavaScript access
    'Secure',             // Only sent over HTTPS
    'SameSite=Strict',    // CSRF protection
    'Path=/',
    'Max-Age=86400',      // 24 hours
  ].join('; '));
  
  return response;
}
```

### Recommended Cookie Security Attributes

1. **HttpOnly** (Server-only)
   - Prevents XSS attacks from stealing cookies
   - Use for: Session tokens, auth cookies, sensitive data
   - **MUST be set server-side only**

2. **Secure** (Client or Server)
   - Ensures cookie only sent over HTTPS
   - Use for: ALL cookies in production
   - Required in production environments

3. **SameSite=Strict** (Client or Server)
   - Best CSRF protection
   - Cookie only sent in first-party context
   - Use for: Auth cookies, session tokens

4. **SameSite=Lax** (Alternative)
   - Good CSRF protection with better UX
   - Allows cookies on top-level navigation
   - Use for: Less sensitive cookies

5. **Path=/** (Client or Server)
   - Limits cookie scope to specific paths
   - Use: Restrict to minimal necessary paths

6. **Max-Age** or **Expires** (Client or Server)
   - Sets cookie lifetime
   - Use: Short-lived for sensitive data (sessions)
   - Use: Longer for convenience (preferences)

## Implementation Checklist

### For Authentication Cookies (Server-Side)
- [ ] Set HttpOnly flag
- [ ] Set Secure flag (in production)
- [ ] Set SameSite=Strict
- [ ] Use short Max-Age (1 hour to 1 day)
- [ ] Rotate tokens regularly
- [ ] Clear on logout (server-side endpoint)

### For CSRF Tokens (Server-Side)
- [ ] Set SameSite=Strict or Lax
- [ ] Set Secure flag
- [ ] Do NOT set HttpOnly (needs client access)
- [ ] Validate on server for state-changing operations

### For Session Management
- [ ] Store sensitive data server-side only
- [ ] Use HttpOnly session cookies
- [ ] Implement session timeout
- [ ] Regenerate session ID on privilege changes
- [ ] Clear all sessions on logout

## Logout Process

### Client-Side (Current Implementation)
```typescript
// Clears all accessible cookies with security flags
clearAllCookies();
// Calls logout API to clear server-side session
await fetch('/api/auth/logout', { method: 'POST' });
```

### Server-Side (Required Implementation)
```typescript
// API Route: /api/auth/logout
export async function POST(request: Request) {
  // Clear HttpOnly session cookies
  const response = new Response(JSON.stringify({ success: true }));
  
  // Clear session cookie
  response.headers.set('Set-Cookie', [
    'session_token=',
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
    'Path=/',
    'Max-Age=0',  // Expire immediately
  ].join('; '));
  
  // Invalidate session on server
  await invalidateSession(sessionId);
  
  return response;
}
```

## Testing Cookie Security

### Manual Testing
1. Open browser DevTools → Application/Storage → Cookies
2. Verify security flags are present:
   - ✅ HttpOnly (for session cookies)
   - ✅ Secure (all cookies)
   - ✅ SameSite=Strict or Lax

### Automated Testing
```typescript
// Test cookie attributes
test('session cookie has security flags', async () => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
  
  const setCookie = response.headers.get('Set-Cookie');
  expect(setCookie).toContain('HttpOnly');
  expect(setCookie).toContain('Secure');
  expect(setCookie).toContain('SameSite=Strict');
});
```

## Security Considerations

### XSS Prevention
- HttpOnly cookies prevent JavaScript access
- Sanitize all user input (see `src/lib/content-sanitizer.ts`)
- Implement Content Security Policy (see `next.config.js`)

### CSRF Prevention
- SameSite=Strict provides strong CSRF protection
- For SameSite=Lax, also implement CSRF tokens
- Validate origin/referer headers

### Session Fixation Prevention
- Regenerate session ID after login
- Don't accept session IDs from URL parameters
- Clear old sessions on logout

### Secure Development Environment
- Use HTTPS even in development (when possible)
- Test with Secure flag locally using `localhost` (treated as secure)
- Never commit cookie values to version control

## References

- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [MDN: Using HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [OWASP Secure Cookie Attribute](https://owasp.org/www-community/controls/SecureCookieAttribute)
- [SameSite Cookie Explained](https://web.dev/samesite-cookies-explained/)

## Next Steps

1. **Implement server-side logout endpoint** with HttpOnly cookie clearing
2. **Audit all cookie usage** across the application
3. **Add session rotation** on authentication events
4. **Implement CSRF token validation** for state-changing operations
5. **Add cookie security tests** to CI/CD pipeline
6. **Document cookie usage** for each service

---

**Last Updated:** December 19, 2025  
**Maintained By:** Security Team
