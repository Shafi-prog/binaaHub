-- Create table for warranty claims
CREATE TABLE warranty_claims (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    warranty_id UUID REFERENCES warranties(id) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    description TEXT NOT NULL,
    claim_type VARCHAR(20) NOT NULL,
    preferred_contact VARCHAR(20) NOT NULL,
    contact_details TEXT NOT NULL,
    photos TEXT[],
    status VARCHAR(20) DEFAULT 'pending' NOT NULL,
    resolution_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create table for warranty transfers
CREATE TABLE warranty_transfers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    warranty_id UUID REFERENCES warranties(id) NOT NULL,
    from_user_id UUID REFERENCES users(id) NOT NULL,
    to_user_id UUID REFERENCES users(id) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' NOT NULL,
    transfer_reason TEXT,
    recipient_name TEXT NOT NULL,
    recipient_phone TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create table for warranty documents
CREATE TABLE warranty_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    warranty_id UUID REFERENCES warranties(id) NOT NULL,
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    size BIGINT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Add transfer_pending field to warranties table
ALTER TABLE warranties ADD COLUMN transfer_pending BOOLEAN DEFAULT false;

-- Add indexes for performance
CREATE INDEX idx_warranty_claims_warranty_id ON warranty_claims(warranty_id);
CREATE INDEX idx_warranty_claims_user_id ON warranty_claims(user_id);
CREATE INDEX idx_warranty_transfers_warranty_id ON warranty_transfers(warranty_id);
CREATE INDEX idx_warranty_transfers_from_user_id ON warranty_transfers(from_user_id);
CREATE INDEX idx_warranty_transfers_to_user_id ON warranty_transfers(to_user_id);
CREATE INDEX idx_warranty_documents_warranty_id ON warranty_documents(warranty_id);

-- Create function to update warranty updated_at timestamp
CREATE OR REPLACE FUNCTION update_warranty_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE warranties 
    SET updated_at = timezone('utc', now())
    WHERE id = NEW.warranty_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to maintain updated_at
CREATE TRIGGER update_warranty_on_claim
    AFTER INSERT OR UPDATE ON warranty_claims
    FOR EACH ROW
    EXECUTE FUNCTION update_warranty_timestamp();

CREATE TRIGGER update_warranty_on_transfer
    AFTER INSERT OR UPDATE ON warranty_transfers
    FOR EACH ROW
    EXECUTE FUNCTION update_warranty_timestamp();

CREATE TRIGGER update_warranty_on_document
    AFTER INSERT OR UPDATE ON warranty_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_warranty_timestamp();
