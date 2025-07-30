-- =============================================================================
-- ATP PLATFORM DATABASE INITIALIZATION
-- =============================================================================
-- This script creates the initial database schema for the ATP Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- USERS AND AUTHENTICATION
-- =============================================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company_name VARCHAR(255),
    phone VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'suspended')),
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('buyer', 'seller', 'broker', 'admin')),
    verification_level INTEGER NOT NULL DEFAULT 0 CHECK (verification_level >= 0 AND verification_level <= 3),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Create indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_verification_level ON users(verification_level);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Permissions table
CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

-- Role permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- =============================================================================
-- AUDIT LOGS
-- =============================================================================

-- User status change logs
CREATE TABLE IF NOT EXISTS user_status_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    changed_by UUID REFERENCES users(id),
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verification level change logs
CREATE TABLE IF NOT EXISTS verification_level_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    old_level INTEGER,
    new_level INTEGER,
    changed_by UUID REFERENCES users(id),
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- AIRCRAFT MARKETPLACE
-- =============================================================================

-- Aircraft listings
CREATE TABLE IF NOT EXISTS aircraft_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    aircraft_model VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    year_manufactured INTEGER,
    tail_number VARCHAR(20),
    hours_total INTEGER,
    price DECIMAL(12,2),
    currency VARCHAR(3) DEFAULT 'USD',
    location_country VARCHAR(2),
    location_city VARCHAR(100),
    description TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'suspended', 'expired')),
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for aircraft listings
CREATE INDEX IF NOT EXISTS idx_aircraft_manufacturer ON aircraft_listings(manufacturer);
CREATE INDEX IF NOT EXISTS idx_aircraft_model ON aircraft_listings(aircraft_model);
CREATE INDEX IF NOT EXISTS idx_aircraft_status ON aircraft_listings(status);
CREATE INDEX IF NOT EXISTS idx_aircraft_price ON aircraft_listings(price);
CREATE INDEX IF NOT EXISTS idx_aircraft_created_at ON aircraft_listings(created_at);

-- Aircraft specifications
CREATE TABLE IF NOT EXISTS aircraft_specifications (
    listing_id UUID PRIMARY KEY REFERENCES aircraft_listings(id) ON DELETE CASCADE,
    engine_type VARCHAR(50),
    engine_hours INTEGER,
    avionics TEXT[],
    interior_configuration VARCHAR(100),
    exterior_color VARCHAR(50),
    max_passengers INTEGER,
    max_range_nm INTEGER,
    max_speed_kts INTEGER,
    useful_load_lbs INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aircraft images
CREATE TABLE IF NOT EXISTS aircraft_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES aircraft_listings(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    mime_type VARCHAR(100),
    size_bytes INTEGER,
    image_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer reservations (unique ATP feature)
CREATE TABLE IF NOT EXISTS customer_reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    broker_id UUID REFERENCES users(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES aircraft_listings(id) ON DELETE CASCADE,
    reserved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'released')),
    UNIQUE(buyer_id, listing_id)
);

-- =============================================================================
-- VERIFICATION SYSTEM
-- =============================================================================

-- Verification requests
CREATE TABLE IF NOT EXISTS verification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    verification_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'documents_required', 'auto_check', 'manual_review', 'approved', 'rejected')),
    estimated_completion TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verification documents
CREATE TABLE IF NOT EXISTS verification_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verification_id UUID REFERENCES verification_requests(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    mime_type VARCHAR(100),
    size_bytes INTEGER,
    status VARCHAR(20) DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'verified', 'rejected')),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- SUBSCRIPTIONS AND PAYMENTS
-- =============================================================================

-- Subscription plans
CREATE TABLE IF NOT EXISTS subscription_plans (
    id VARCHAR(50) PRIMARY KEY, -- basic, professional, enterprise
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    billing_interval VARCHAR(20) NOT NULL, -- monthly, yearly
    features JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id VARCHAR(50) REFERENCES subscription_plans(id),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    auto_renew BOOLEAN DEFAULT TRUE,
    stripe_subscription_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    type VARCHAR(20) NOT NULL CHECK (type IN ('subscription', 'commission', 'refund')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    reference_id UUID, -- listing_id for commissions, subscription_id for subscriptions
    stripe_payment_intent_id VARCHAR(100),
    description TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- NOTIFICATIONS
-- =============================================================================

-- Notification templates
CREATE TABLE IF NOT EXISTS notification_templates (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'sms', 'push')),
    subject VARCHAR(255),
    template_html TEXT,
    template_text TEXT,
    variables JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User notifications
CREATE TABLE IF NOT EXISTS user_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INSERT DEFAULT DATA
-- =============================================================================

-- Insert default roles
INSERT INTO roles (name, description) VALUES
    ('admin', 'Platform administrator with full access'),
    ('buyer', 'Aircraft buyer with basic platform access'),
    ('seller', 'Aircraft seller with listing capabilities'),
    ('broker', 'Aviation broker with enhanced features')
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions
INSERT INTO permissions (name, resource, action, description) VALUES
    ('read_users', 'users', 'read', 'View user information'),
    ('write_users', 'users', 'write', 'Create and modify users'),
    ('delete_users', 'users', 'delete', 'Delete user accounts'),
    ('read_listings', 'listings', 'read', 'View aircraft listings'),
    ('write_listings', 'listings', 'write', 'Create and modify listings'),
    ('delete_listings', 'listings', 'delete', 'Delete aircraft listings'),
    ('manage_verification', 'verification', 'manage', 'Manage user verification'),
    ('read_analytics', 'analytics', 'read', 'Access platform analytics'),
    ('manage_payments', 'payments', 'manage', 'Manage payments and subscriptions'),
    ('send_notifications', 'notifications', 'send', 'Send notifications to users')
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to roles
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'admin'  -- Admin gets all permissions
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'buyer' AND p.name IN ('read_listings')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'seller' AND p.name IN ('read_listings', 'write_listings', 'delete_listings')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'broker' AND p.name IN ('read_listings', 'write_listings', 'read_analytics')
ON CONFLICT DO NOTHING;

-- Insert default subscription plans
        INSERT INTO subscription_plans (id, name, description, price, billing_interval, features) VALUES
            ('basic', 'Basic Plan', 'Basic access to verified marketplace', 500.00, 'monthly', 
             '{"max_listings": 5, "verification": "basic", "support": "email"}'),
            ('professional', 'Professional Plan', 'Enhanced features with analytics and priority support', 1500.00, 'monthly',
             '{"max_listings": 25, "verification": "professional", "analytics": true, "support": "priority"}'),
            ('enterprise', 'Enterprise Plan', 'Full platform access with custom reports and API access', 3000.00, 'monthly',
             '{"max_listings": "unlimited", "verification": "premium", "analytics": true, "api_access": true, "support": "dedicated"}')
        ON CONFLICT (id) DO NOTHING;

-- Insert notification templates
INSERT INTO notification_templates (id, name, type, subject, template_html, template_text) VALUES
    ('welcome_email', 'Welcome Email', 'email', 'Welcome to ATP Platform', 
     '<h1>Welcome {{firstName}}!</h1><p>Thank you for joining ATP Platform.</p>',
     'Welcome {{firstName}}! Thank you for joining ATP Platform.'),
    ('verification_complete', 'Verification Complete', 'email', 'Your account has been verified',
     '<h1>Congratulations {{firstName}}!</h1><p>Your account verification is complete.</p>',
     'Congratulations {{firstName}}! Your account verification is complete.')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- CREATE ADMIN USER (for development)
-- =============================================================================

-- Insert default admin user (password: Admin123!)
-- Note: This should be removed or changed in production
INSERT INTO users (
    id, email, password_hash, first_name, last_name, 
    user_type, status, verification_level
) VALUES (
    uuid_generate_v4(),
    'admin@atpplatform.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfN5e6UXM1/XqZy', -- Admin123!
    'ATP',
    'Administrator',
    'admin',
    'verified',
    3
) ON CONFLICT (email) DO NOTHING;

-- Assign admin role to admin user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r 
WHERE u.email = 'admin@atpplatform.com' AND r.name = 'admin'
ON CONFLICT DO NOTHING;

-- =============================================================================
-- FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_aircraft_listings_updated_at ON aircraft_listings;
CREATE TRIGGER update_aircraft_listings_updated_at 
    BEFORE UPDATE ON aircraft_listings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_verification_requests_updated_at ON verification_requests;
CREATE TRIGGER update_verification_requests_updated_at 
    BEFORE UPDATE ON verification_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- VIEWS FOR COMMON QUERIES
-- =============================================================================

-- View for users with their roles
CREATE OR REPLACE VIEW users_with_roles AS
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.company_name,
    u.phone,
    u.status,
    u.user_type,
    u.verification_level,
    u.created_at,
    u.updated_at,
    u.last_login,
    COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT('id', r.id, 'name', r.name, 'description', r.description)
        ) FILTER (WHERE r.id IS NOT NULL), 
        '[]'
    ) as roles
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
GROUP BY u.id, u.email, u.first_name, u.last_name, u.company_name, u.phone,
         u.status, u.user_type, u.verification_level, u.created_at, u.updated_at, u.last_login;

-- View for active aircraft listings with seller info
CREATE OR REPLACE VIEW active_listings_with_seller AS
SELECT 
    al.*,
    u.company_name as seller_company,
    u.verification_level as seller_verification_level
FROM aircraft_listings al
JOIN users u ON al.seller_id = u.id
WHERE al.status = 'active' AND u.status = 'verified';

COMMIT; 