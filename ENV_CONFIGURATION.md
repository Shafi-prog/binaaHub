# Environment Configuration

## File Structure

The project uses a simplified environment configuration with only 3 files:

### `.env` (Base Configuration)
- **Committed to git**
- Contains base configuration for all environments
- Includes production-ready Supabase instance and all service configurations
- Safe to share as it contains no sensitive data

### `.env.local` (Local Overrides)
- **Git-ignored for security**
- Contains only local development-specific overrides
- Use this file to customize settings for your local environment
- Currently empty - only add values that differ from `.env`

### `.env.example` (Template)
- **Committed to git**
- Template file for new developers
- Shows all available configuration options
- Copy to `.env.local` and customize as needed

## Setup for New Developers

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Update any values in `.env.local` that need to be different for your local environment

3. The application will automatically use:
   - Base values from `.env`
   - Overrides from `.env.local` (if present)

## Environment Variables Priority

Next.js loads environment variables in this order:
1. `.env.local` (highest priority)
2. `.env`
3. `.env.example` (template only, not loaded)

## Security Notes

- Never commit sensitive keys to git
- Use `.env.local` for any sensitive or personal configuration
- The `.env` file contains development/demo credentials that are safe to share
