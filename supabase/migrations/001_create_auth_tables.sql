-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Fallback to use gen_random_uuid() if uuid-ossp is not available
CREATE OR REPLACE FUNCTION uuid_generate_v4()
RETURNS UUID AS $$
BEGIN
    RETURN gen_random_uuid();
EXCEPTION
    WHEN OTHERS THEN
        RETURN gen_random_uuid();
END;
$$ LANGUAGE plpgsql;

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('creator', 'brand');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Main profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    role user_role NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Creator-specific profiles
CREATE TABLE IF NOT EXISTS creator_profiles (
    id UUID REFERENCES profiles(id) PRIMARY KEY,
    bio TEXT,
    categories TEXT[] DEFAULT '{}',
    social_links JSONB DEFAULT '{}',
    portfolio_items JSONB DEFAULT '[]',
    audience_demographics JSONB DEFAULT '{}',
    content_types TEXT[] DEFAULT '{}',
    collaboration_preferences JSONB DEFAULT '{}',
    pricing_structure JSONB DEFAULT '{}',
    availability_status TEXT DEFAULT 'available',
    verification_status TEXT DEFAULT 'pending',
    performance_metrics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brand-specific profiles  
CREATE TABLE IF NOT EXISTS brand_profiles (
    id UUID REFERENCES profiles(id) PRIMARY KEY,
    company_name TEXT,
    industry TEXT,
    company_size TEXT,
    website_url TEXT,
    description TEXT,
    brand_values TEXT[] DEFAULT '{}',
    target_demographics JSONB DEFAULT '{}',
    marketing_goals TEXT[] DEFAULT '{}',
    brand_assets JSONB DEFAULT '{}',
    campaign_preferences JSONB DEFAULT '{}',
    budget_range JSONB DEFAULT '{}',
    verification_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    brand_id UUID REFERENCES brand_profiles(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    requirements JSONB DEFAULT '{}',
    budget JSONB DEFAULT '{}',
    timeline JSONB DEFAULT '{}',
    deliverables TEXT[] DEFAULT '{}',
    target_audience JSONB DEFAULT '{}',
    campaign_type TEXT,
    status TEXT DEFAULT 'draft',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    campaign_id UUID REFERENCES campaigns(id) NOT NULL,
    creator_id UUID REFERENCES creator_profiles(id) NOT NULL,
    status TEXT DEFAULT 'pending',
    proposal TEXT,
    proposed_timeline JSONB DEFAULT '{}',
    proposed_budget JSONB DEFAULT '{}',
    portfolio_links TEXT[] DEFAULT '{}',
    custom_message TEXT,
    match_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, creator_id)
);

-- Collaborations table
CREATE TABLE IF NOT EXISTS collaborations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    application_id UUID REFERENCES applications(id) NOT NULL,
    campaign_id UUID REFERENCES campaigns(id) NOT NULL,
    creator_id UUID REFERENCES creator_profiles(id) NOT NULL,
    brand_id UUID REFERENCES brand_profiles(id) NOT NULL,
    status TEXT DEFAULT 'active',
    contract_terms JSONB DEFAULT '{}',
    deliverables_status JSONB DEFAULT '{}',
    payment_status TEXT DEFAULT 'pending',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table for communication
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID NOT NULL,
    sender_id UUID REFERENCES profiles(id) NOT NULL,
    recipient_id UUID REFERENCES profiles(id) NOT NULL,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text',
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    type TEXT NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE,
    action_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_categories ON creator_profiles USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_campaigns_brand_id ON campaigns(brand_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_applications_campaign_id ON applications(campaign_id);
CREATE INDEX IF NOT EXISTS idx_applications_creator_id ON applications(creator_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON notifications(read_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_profiles_updated_at BEFORE UPDATE ON creator_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_profiles_updated_at BEFORE UPDATE ON brand_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collaborations_updated_at BEFORE UPDATE ON collaborations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();