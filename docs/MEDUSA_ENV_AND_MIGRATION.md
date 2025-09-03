# Medusa integration: environment switch and migration audit

This project contains legacy Medusa usage that is being phased out in favor of ERP/Supabase. Use the environment switch to hard-disable any external Medusa calls while keeping types and UI utilities available for now.

## Environment variables

- NEXT_PUBLIC_MEDUSA_ENABLE
  - Purpose: globally enable/disable calling the external Medusa backend from the web app.
  - Default: disabled (no network calls) unless explicitly set to "true".
  - Values:
    - "true": enable Medusa requests in `src/core/shared/services/medusa-integration.ts`.
    - any other/undefined: disable requests and short-circuit with MEDUSA_DISABLED.

- NEXT_PUBLIC_MEDUSA_BACKEND_URL
  - Purpose: base URL for Medusa backend when enabled.
  - Default: http://localhost:9000

- MEDUSA_API_KEY
  - Purpose: optional bearer token for authenticated requests.
  - Default: undefined (no Authorization header)

### Example .env.local

NEXT_PUBLIC_MEDUSA_ENABLE=false
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_API_KEY=

## Behavior when disabled

When NEXT_PUBLIC_MEDUSA_ENABLE !== "true":
- The integration service will not perform network requests and will throw MEDUSA_DISABLED early.
- App code should catch/use fallbacks or treat the lack of Medusa as a no-op.

## Migration audit (imports)

Run the scan to list all remaining Medusa imports and their files:

- npm run scan:medusa
  - prints a table to stdout
- npm run scan:medusa:md
  - writes a Markdown report to docs/MEDUSA_IMPORTS_REPORT.md

Allowed (temporary) import hotspots:
- src/core/shared/services/medusa-integration.ts
- type-only declarations under src/**/types/**

All other occurrences should be queued for replacement with ERP/Supabase equivalents.

## Replacement guidelines

1) Types: Replace @medusajs/types with local DTOs or zod schemas that match our Supabase shapes.
2) UI icons/components: Switch to lucide-react or existing shared UI wrappers.
3) SDK calls: Replace with Supabase REST/RPC or internal API routes.

Keep PRs small: one folder/domain at a time, with a brief note in the report.
