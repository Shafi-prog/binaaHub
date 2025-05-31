-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    avatar_url TEXT,
    country_code VARCHAR(10) DEFAULT '+966',
    date_of_birth DATE,
    gender VARCHAR(20),
    occupation TEXT,
    company_name TEXT,
    national_id VARCHAR(50),
    emergency_contact_name TEXT,
    emergency_contact_phone VARCHAR(50),
    preferred_language VARCHAR(10) DEFAULT 'ar',
    notification_preferences JSONB DEFAULT '{"email": true, "sms": true, "push": true}',
    coordinates JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT user_profiles_unique_user UNIQUE (user_id)
);

-- Add trigger for updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add index
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
