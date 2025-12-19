# Security Policy

## Reporting Security Issues

If you discover a security vulnerability in this project, please report it to the repository maintainers privately. Do not open a public issue.

## Critical Security Advisory - Exposed Credentials

**⚠️ URGENT: Credentials Exposure Detected**

The `.env` file was previously tracked in version control and contained sensitive production credentials. This file has now been removed from tracking, but the exposed credentials remain in the git history.

### Exposed Credentials Requiring Immediate Rotation

The following credentials were exposed and **MUST BE ROTATED IMMEDIATELY**:

1. **Supabase Credentials**
   - Service Role Key: `[REDACTED]` (ROTATE IMMEDIATELY)
   - Database Password: `[REDACTED]` (CHANGE IMMEDIATELY)
   - Project URL: `https://lqhopwohuddhapkhhikf.supabase.co`
   
   **Action Required:**
   - Log into Supabase Dashboard
   - Go to Settings → API
   - Generate new API keys
   - Reset database password
   - Update all deployment environments

2. **Google OAuth Credentials**
   - Client Secret: `[REDACTED]` (REVOKE & REGENERATE)
   
   **Action Required:**
   - Visit Google Cloud Console
   - Navigate to APIs & Services → Credentials
   - Delete and create new OAuth 2.0 credentials
   - Update authorized redirect URIs

3. **Authentication Secrets**
   - NEXTAUTH_SECRET: `[REDACTED]` (REGENERATE)
   - JWT_SECRET: `[REDACTED]` (REGENERATE)
   - COOKIE_SECRET: `[REDACTED]` (REGENERATE)
   
   **Action Required:**
   - Generate new random secrets using: `openssl rand -base64 32`
   - Update in all deployment environments
   - This will invalidate all existing sessions

4. **Gemini API Key**
   - API Key: `[REDACTED]` (REVOKE & REGENERATE)
   
   **Action Required:**
   - Visit Google AI Studio or Cloud Console
   - Revoke the exposed API key
   - Generate a new API key
   - Update in secure environment variables

5. **Medusa Commerce Keys**
   - Publishable Key: `[REDACTED]` (REGENERATE)
   
   **Action Required:**
   - Access Medusa admin panel
   - Regenerate publishable keys
   - Update in environment configuration

### Immediate Actions Required

1. **Rotate All Credentials** - Follow the instructions above for each service
2. **Monitor for Suspicious Activity** - Check logs for unauthorized access
3. **Update Deployment Environments** - Ensure all platforms (Vercel, etc.) use new credentials
4. **Review Access Logs** - Check Supabase, Google Cloud, and other services for unusual activity
5. **Consider Security Audit** - Review other potential exposures in the codebase

### Timeline

- **Discovered:** December 19, 2025
- **Removed from tracking:** December 19, 2025
- **Credential rotation deadline:** Within 24-48 hours

## Best Practices for Environment Variables

### DO:
- ✅ Use `.env.local` for local development (git-ignored by default)
- ✅ Use `.env.example` as a template with placeholder values
- ✅ Store production secrets in secure vaults (Vercel, AWS Secrets Manager, etc.)
- ✅ Use different credentials for development, staging, and production
- ✅ Rotate credentials regularly
- ✅ Use strong, randomly generated secrets
- ✅ Limit API key permissions to minimum required

### DON'T:
- ❌ Never commit `.env` files with real credentials
- ❌ Never commit API keys, passwords, or secrets to version control
- ❌ Never share credentials via email, chat, or public channels
- ❌ Never use the same credentials across environments
- ❌ Never hardcode credentials in source code

## Environment Variable Setup

### For Local Development

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your development credentials
   - Never commit `.env.local` to git
   - Use test/development credentials only

3. Generate secure secrets:
   ```bash
   # Generate NEXTAUTH_SECRET
   openssl rand -base64 32
   
   # Generate JWT_SECRET
   openssl rand -base64 32
   
   # Generate COOKIE_SECRET
   openssl rand -base64 32
   ```

### For Production Deployment

1. **Vercel/Netlify:**
   - Add environment variables through the platform dashboard
   - Never commit production credentials to git

2. **Docker/Container Deployments:**
   - Use environment variable injection
   - Use secrets management (Docker Secrets, Kubernetes Secrets)

3. **Cloud Platforms:**
   - Use AWS Secrets Manager, Google Secret Manager, or Azure Key Vault
   - Grant minimal permissions

## Security Checklist

- [x] Remove `.env` from git tracking
- [x] Update `.gitignore` to prevent future commits
- [x] Document exposed credentials
- [ ] **URGENT: Rotate all exposed credentials**
- [ ] **URGENT: Monitor for unauthorized access**
- [ ] Update all deployment environments with new credentials
- [ ] Review git history for other sensitive data
- [ ] Implement pre-commit hooks to prevent credential commits
- [ ] Set up secret scanning (GitHub Advanced Security)
- [ ] Conduct security audit

## Git History Cleanup (Advanced)

**Note:** Cleaning git history is complex and can break existing clones. Coordinate with all team members.

If you need to remove sensitive data from git history:

```bash
# WARNING: This rewrites git history
# Backup repository first
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env' \
  --prune-empty --tag-name-filter cat -- --all

# Force push (coordinate with team)
git push origin --force --all
```

Consider using tools like:
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [git-filter-repo](https://github.com/newren/git-filter-repo)

## Additional Resources

- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [12 Factor App - Config](https://12factor.net/config)

## Contact

For security concerns, contact the repository maintainers directly.

---

## Secure Coding Patterns (Updated December 2024)

### ✅ Security Fixes Applied

As of December 19, 2024, the following security improvements have been implemented:

#### 1. Cryptographically Secure Random Generation

**Problem:** Using `Math.random()` for security-sensitive operations (UUIDs, passwords, session IDs) is insecure.

**Solution:** Use the `secure-random` utility library:

```typescript
import { 
  generateSecureUUID, 
  generateSecurePassword, 
  generateSecureSessionId,
  generateSecureRandomString,
  generateSecureToken,
  generateSecureRandomInt
} from '@/lib/secure-random';

// Generate secure UUID for ZATCA compliance, user IDs, etc.
const uuid = generateSecureUUID();

// Generate secure temporary password
const tempPassword = generateSecurePassword(16);

// Generate secure session ID
const sessionId = generateSecureSessionId();

// Generate secure random string
const randomString = generateSecureRandomString(32);

// Generate secure token
const token = generateSecureToken(32);

// Generate secure random integer
const randomInt = generateSecureRandomInt(0, 100);
```

**❌ DON'T:**
```typescript
// Insecure - predictable and not cryptographically secure
const uuid = 'xxxx-xxxx'.replace(/x/g, () => (Math.random() * 16 | 0).toString(16));
const password = 'temp_' + Math.random().toString(36).slice(-8);
```

#### 2. Proper String Sanitization

**Problem:** Incomplete HTML sanitization can lead to XSS attacks.

**Solution:** Use DOMPurify for all HTML sanitization:

```typescript
import { sanitizeString } from '@/lib/sanitize';

// Sanitize user input (strips HTML)
const clean = sanitizeString(userInput, { allowHtml: false });

// Sanitize with allowed HTML tags
const cleanHtml = sanitizeString(userInput, {
  allowHtml: true,
  allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p'],
  allowedAttributes: { a: ['href', 'title'] }
});
```

**❌ DON'T:**
```typescript
// Insecure - can be bypassed
const clean = input.replace(/<[^>]*>/g, '');
```

#### 3. Proper Regular Expression Escaping

**Problem:** Unescaped special characters in regex patterns can cause injection vulnerabilities.

**Solution:** Properly escape special regex characters:

```typescript
// Escape special regex characters except wildcards
const escapedKey = key.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, ".*");
const regExp = new RegExp(`^${escapedKey}$`);
```

**❌ DON'T:**
```typescript
// Insecure - special characters not escaped
const regExp = new RegExp(key.replace("*", ".*"));
```

#### 4. No Sensitive Data in Logs

**Problem:** Logging passwords, API keys, or tokens can expose them.

**Solution:** Redact sensitive information:

```typescript
// ✅ Good - redact passwords
console.log(`User: ${user.email} / [REDACTED]`);

// ✅ Good - redact tokens
console.log(`Token: ${token.substring(0, 8)}...`);
```

**❌ DON'T:**
```typescript
// Bad - exposes sensitive data
console.log(`Password: ${password}`);
console.log(`API Key: ${apiKey}`);
```

#### 5. GitHub Actions Security

All GitHub Actions workflows now include explicit permissions following the principle of least privilege:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read      # Only read access to repository
      checks: write       # Write access to checks (for test results)
    steps:
      # ...
```

### Security Resources

- **Secure Random Library:** `/src/lib/secure-random.ts`
- **Sanitization Library:** `/src/lib/sanitize.ts`
- **Secrets Documentation:** `SECRETS_REMOVED.md`

### Security Testing

Before committing code, ensure:
1. No hardcoded secrets or credentials
2. No `Math.random()` for security-sensitive operations
3. All user input is properly sanitized
4. No sensitive data in log statements
5. All regex patterns properly escape special characters
6. GitHub Actions have explicit permissions

For more information, see `SECRETS_REMOVED.md`.
