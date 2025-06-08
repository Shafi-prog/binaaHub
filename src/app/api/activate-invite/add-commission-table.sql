-- Create invitation_commissions table for tracking invitation/commission activations
CREATE TABLE IF NOT EXISTS invitation_commissions (
  id SERIAL PRIMARY KEY,
  invited_user_id UUID NOT NULL,
  inviter_user_id UUID,
  inviter_store_id UUID,
  code TEXT NOT NULL,
  activated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (invited_user_id, code)
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_invitation_commissions_code ON invitation_commissions(code);
