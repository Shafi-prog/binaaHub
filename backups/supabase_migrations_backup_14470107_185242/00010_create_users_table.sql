-- Create users table to store user profile data
-- This table extends the auth.users table with additional user information

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    account_type VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (account_type IN ('user', 'store', 'client', 'engineer', 'consultant', 'admin')),
    city VARCHAR(100),
    region VARCHAR(100),
    address TEXT,
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'banned')),
    invitation_code VARCHAR(32) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_account_type ON users(account_type);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_invitation_code ON users(invitation_code);

-- Add trigger for updated_at
CREATE OR REPLACE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE policyname = 'Users can view own data'
          AND tablename = 'users'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE policyname = 'Users can update own data'
          AND tablename = 'users'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE policyname = 'Authenticated users can insert'
          AND tablename = 'users'
    ) THEN
        EXECUTE 'CREATE POLICY "Authenticated users can insert" ON users FOR INSERT WITH CHECK (auth.uid() = id);';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE policyname = 'Admins can view all users'
          AND tablename = 'users'
    ) THEN
        EXECUTE 'CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = ''admin''));';
    END IF;
END $$;
