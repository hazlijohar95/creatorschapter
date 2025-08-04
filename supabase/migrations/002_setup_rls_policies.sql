-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view other profiles for discovery" ON profiles
    FOR SELECT USING (true);

-- Creator profiles policies
CREATE POLICY "Creators can view their own creator profile" ON creator_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Creators can update their own creator profile" ON creator_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Creators can insert their own creator profile" ON creator_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Brands can view creator profiles for discovery" ON creator_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'brand'
        )
    );

-- Brand profiles policies
CREATE POLICY "Brands can view their own brand profile" ON brand_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Brands can update their own brand profile" ON brand_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Brands can insert their own brand profile" ON brand_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Creators can view brand profiles for discovery" ON brand_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'creator'
        )
    );

-- Campaigns policies
CREATE POLICY "Brands can manage their own campaigns" ON campaigns
    FOR ALL USING (
        brand_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM brand_profiles 
            WHERE id = auth.uid() AND id = brand_id
        )
    );

CREATE POLICY "Creators can view active campaigns" ON campaigns
    FOR SELECT USING (
        status = 'active' AND
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'creator'
        )
    );

-- Applications policies
CREATE POLICY "Creators can manage their own applications" ON applications
    FOR ALL USING (creator_id = auth.uid());

CREATE POLICY "Brands can view applications to their campaigns" ON applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM campaigns 
            WHERE id = campaign_id AND brand_id = auth.uid()
        )
    );

CREATE POLICY "Brands can update applications to their campaigns" ON applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM campaigns 
            WHERE id = campaign_id AND brand_id = auth.uid()
        )
    );

-- Collaborations policies
CREATE POLICY "Users can view their own collaborations" ON collaborations
    FOR SELECT USING (creator_id = auth.uid() OR brand_id = auth.uid());

CREATE POLICY "Users can update their own collaborations" ON collaborations
    FOR UPDATE USING (creator_id = auth.uid() OR brand_id = auth.uid());

CREATE POLICY "Brands can create collaborations" ON collaborations
    FOR INSERT WITH CHECK (brand_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can view their own messages" ON messages
    FOR SELECT USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can mark their received messages as read" ON messages
    FOR UPDATE USING (recipient_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON notifications
    FOR INSERT WITH CHECK (true);

-- Create a function to check if user profile is complete
CREATE OR REPLACE FUNCTION is_profile_complete(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_role user_role;
    profile_complete BOOLEAN := false;
BEGIN
    -- Get user role
    SELECT role INTO user_role FROM profiles WHERE id = user_id;
    
    IF user_role = 'creator' THEN
        SELECT EXISTS (
            SELECT 1 FROM creator_profiles 
            WHERE id = user_id 
            AND bio IS NOT NULL 
            AND array_length(categories, 1) > 0
        ) INTO profile_complete;
    ELSIF user_role = 'brand' THEN
        SELECT EXISTS (
            SELECT 1 FROM brand_profiles 
            WHERE id = user_id 
            AND company_name IS NOT NULL 
            AND industry IS NOT NULL
        ) INTO profile_complete;
    END IF;
    
    RETURN profile_complete;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to handle user profile creation via trigger
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- This function will be called when a new user signs up
    -- The actual profile creation will be handled by the application
    -- This is just a placeholder for future database-level logic
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation (optional - application handles this)
-- CREATE TRIGGER on_auth_user_created
--     AFTER INSERT ON auth.users
--     FOR EACH ROW EXECUTE FUNCTION handle_new_user();