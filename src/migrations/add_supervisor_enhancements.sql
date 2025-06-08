-- Add user balances table
CREATE TABLE IF NOT EXISTS "user_balances" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "current_balance" DECIMAL(12, 2) NOT NULL DEFAULT 0,
  "currency" VARCHAR(5) NOT NULL DEFAULT 'SAR',
  "last_deposit_date" TIMESTAMPTZ,
  "last_withdrawal_date" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_user_balances_user_id" ON "user_balances" ("user_id");

-- Add balance transactions table
CREATE TABLE IF NOT EXISTS "balance_transactions" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "transaction_type" VARCHAR(20) NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal', 'payment', 'refund', 'commission')),
  "amount" DECIMAL(12, 2) NOT NULL,
  "currency" VARCHAR(5) NOT NULL DEFAULT 'SAR',
  "status" VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  "reference_id" UUID,
  "reference_type" VARCHAR(20) CHECK (reference_type IN ('project', 'contract', 'expense', 'authorization', 'commission')),
  "payment_method" VARCHAR(50),
  "transaction_date" TIMESTAMPTZ NOT NULL,
  "description" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_transactions_user_id" ON "balance_transactions" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_transactions_type" ON "balance_transactions" ("transaction_type");
CREATE INDEX IF NOT EXISTS "idx_transactions_date" ON "balance_transactions" ("transaction_date");

-- Add spending authorizations table
CREATE TABLE IF NOT EXISTS "spending_authorizations" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "supervisor_id" UUID NOT NULL REFERENCES "construction_supervisors" ("id") ON DELETE CASCADE,
  "project_id" UUID NOT NULL REFERENCES "projects" ("id") ON DELETE CASCADE,
  "contract_id" UUID REFERENCES "construction_contracts" ("id") ON DELETE SET NULL,
  "amount" DECIMAL(12, 2) NOT NULL,
  "currency" VARCHAR(5) NOT NULL DEFAULT 'SAR',
  "purpose" TEXT NOT NULL,
  "authorization_type" VARCHAR(20) NOT NULL CHECK (authorization_type IN ('one_time', 'recurring', 'category_based')),
  "category" VARCHAR(50),
  "spending_limit" DECIMAL(12, 2) NOT NULL,
  "status" VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'expired', 'cancelled')),
  "approved_date" TIMESTAMPTZ,
  "expiry_date" TIMESTAMPTZ,
  "notes" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_authorizations_user_id" ON "spending_authorizations" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_authorizations_supervisor_id" ON "spending_authorizations" ("supervisor_id");
CREATE INDEX IF NOT EXISTS "idx_authorizations_project_id" ON "spending_authorizations" ("project_id");
CREATE INDEX IF NOT EXISTS "idx_authorizations_status" ON "spending_authorizations" ("status");

-- Add commission records table
CREATE TABLE IF NOT EXISTS "commission_records" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "supervisor_id" UUID NOT NULL REFERENCES "construction_supervisors" ("id") ON DELETE CASCADE,
  "user_id" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "project_id" UUID NOT NULL REFERENCES "projects" ("id") ON DELETE CASCADE,
  "expense_id" UUID REFERENCES "project_expenses" ("id") ON DELETE SET NULL,
  "purchase_id" UUID,
  "transaction_id" UUID,
  "commission_type" VARCHAR(20) NOT NULL CHECK (commission_type IN ('purchase', 'project_completion', 'milestone')),
  "amount" DECIMAL(12, 2) NOT NULL,
  "percentage" DECIMAL(5, 2) NOT NULL,
  "base_amount" DECIMAL(12, 2) NOT NULL,
  "currency" VARCHAR(5) NOT NULL DEFAULT 'SAR',
  "status" VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'paid', 'cancelled')),
  "payment_date" TIMESTAMPTZ,
  "description" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_commissions_supervisor_id" ON "commission_records" ("supervisor_id");
CREATE INDEX IF NOT EXISTS "idx_commissions_project_id" ON "commission_records" ("project_id");
CREATE INDEX IF NOT EXISTS "idx_commissions_status" ON "commission_records" ("status");

-- Add warranty records table
CREATE TABLE IF NOT EXISTS "warranty_records" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "project_id" UUID NOT NULL REFERENCES "projects" ("id") ON DELETE CASCADE,
  "expense_id" UUID REFERENCES "project_expenses" ("id") ON DELETE SET NULL,
  "purchase_id" UUID,
  "item_name" VARCHAR(255) NOT NULL,
  "vendor_name" VARCHAR(255),
  "vendor_contact" VARCHAR(255),
  "purchase_date" DATE NOT NULL,
  "warranty_start_date" DATE NOT NULL,
  "warranty_end_date" DATE NOT NULL,
  "warranty_terms" TEXT,
  "warranty_document_url" TEXT,
  "registered_by" UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  "status" VARCHAR(20) NOT NULL CHECK (status IN ('active', 'expired', 'claimed')),
  "claim_date" TIMESTAMPTZ,
  "claim_details" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_warranties_project_id" ON "warranty_records" ("project_id");
CREATE INDEX IF NOT EXISTS "idx_warranties_registered_by" ON "warranty_records" ("registered_by");
CREATE INDEX IF NOT EXISTS "idx_warranties_status" ON "warranty_records" ("status");
CREATE INDEX IF NOT EXISTS "idx_warranties_end_date" ON "warranty_records" ("warranty_end_date");

-- Create RLS policies
ALTER TABLE "user_balances" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "balance_transactions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "spending_authorizations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "commission_records" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "warranty_records" ENABLE ROW LEVEL SECURITY;

-- User balance policies
CREATE POLICY "Users can view their own balance" 
ON "user_balances" FOR SELECT 
USING (auth.uid() = user_id);

-- Balance transactions policies
CREATE POLICY "Users can view their own transactions" 
ON "balance_transactions" FOR SELECT 
USING (auth.uid() = user_id);

-- Spending authorizations policies
CREATE POLICY "Users can view authorizations they're involved in" 
ON "spending_authorizations" FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() IN (
  SELECT cs.user_id FROM construction_supervisors cs WHERE cs.id = supervisor_id
));

-- Commission records policies
CREATE POLICY "Users can view commissions they're involved in" 
ON "commission_records" FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() IN (
  SELECT cs.user_id FROM construction_supervisors cs WHERE cs.id = supervisor_id
));

-- Warranty records policies
CREATE POLICY "Users can view warranties for their projects" 
ON "warranty_records" FOR SELECT 
USING (
  auth.uid() = registered_by OR 
  auth.uid() IN (SELECT p.user_id FROM projects p WHERE p.id = project_id) OR
  auth.uid() IN (
    SELECT cs.user_id FROM construction_supervisors cs 
    JOIN construction_contracts cc ON cs.id = cc.supervisor_id
    WHERE cc.project_id = project_id
  )
);
