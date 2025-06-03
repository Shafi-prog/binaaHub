-- Add location fields to user_profiles table to match project location structure
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS region VARCHAR(100),
ADD COLUMN IF NOT EXISTS district VARCHAR(100),
ADD COLUMN IF NOT EXISTS neighborhood VARCHAR(100),
ADD COLUMN IF NOT EXISTS address TEXT;

-- Add indexes for location-based queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_city ON user_profiles(city);
CREATE INDEX IF NOT EXISTS idx_user_profiles_region ON user_profiles(region);
CREATE INDEX IF NOT EXISTS idx_user_profiles_region_city ON user_profiles(region, city);

-- Add comment
COMMENT ON COLUMN user_profiles.city IS 'User city for location-based services';
COMMENT ON COLUMN user_profiles.region IS 'User region for location-based services';
COMMENT ON COLUMN user_profiles.district IS 'User district for detailed location';
COMMENT ON COLUMN user_profiles.neighborhood IS 'User neighborhood for precise location';
COMMENT ON COLUMN user_profiles.address IS 'User detailed address';
