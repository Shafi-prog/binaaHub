-- Migration: Add invitation_code to users and stores
ALTER TABLE users ADD COLUMN IF NOT EXISTS invitation_code VARCHAR(32) UNIQUE;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS invitation_code VARCHAR(32) UNIQUE;

-- Optional: Backfill for existing users/stores (Postgres syntax)
UPDATE users SET invitation_code = 'BinnaHub-' || substr(md5(random()::text), 1, 8) WHERE invitation_code IS NULL;
UPDATE stores SET invitation_code = 'BinnaHub-' || substr(md5(random()::text), 1, 8) WHERE invitation_code IS NULL;
