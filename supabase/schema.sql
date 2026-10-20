-- ==============================================================================
-- PALATE: Competitive Food Discovery & Leaderboard Platform
-- Production Supabase Database Schema & Migration Script
-- Focus Node: Navi Mumbai Food Battles (Vashi, Nerul, Belapur, Kharghar, Seawoods, Sanpada)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. RESTAURANTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    neighborhood TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_restaurants_neighborhood ON public.restaurants (neighborhood);

-- ------------------------------------------------------------------------------
-- 2. BATTLES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.battles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    dish_name TEXT NOT NULL,
    restaurant_a_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    restaurant_b_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    votes_a INT DEFAULT 0 NOT NULL CHECK (votes_a >= 0),
    votes_b INT DEFAULT 0 NOT NULL CHECK (votes_b >= 0),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_battles_active ON public.battles (is_active, ends_at);
CREATE INDEX IF NOT EXISTS idx_battles_restaurant_a ON public.battles (restaurant_a_id);
CREATE INDEX IF NOT EXISTS idx_battles_restaurant_b ON public.battles (restaurant_b_id);

-- ------------------------------------------------------------------------------
-- 3. VOTE LOGS TABLE (ANTI-CHEAT ENGINE)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vote_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    battle_id UUID NOT NULL REFERENCES public.battles(id) ON DELETE CASCADE,
    voter_fingerprint TEXT NOT NULL,
    chosen_restaurant UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_battle_voter UNIQUE (battle_id, voter_fingerprint)
);

CREATE INDEX IF NOT EXISTS idx_vote_logs_battle_fingerprint ON public.vote_logs (battle_id, voter_fingerprint);
CREATE INDEX IF NOT EXISTS idx_vote_logs_voter ON public.vote_logs (voter_fingerprint);

-- ------------------------------------------------------------------------------
-- 4. FOOD PASSPORTS / PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.food_passports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fingerprint TEXT NOT NULL UNIQUE,
    dishes_tried_count INT DEFAULT 0 NOT NULL CHECK (dishes_tried_count >= 0),
    restaurants_discovered_count INT DEFAULT 0 NOT NULL CHECK (restaurants_discovered_count >= 0),
    neighborhoods_explored_count INT DEFAULT 0 NOT NULL CHECK (neighborhoods_explored_count >= 0),
    badges JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE OR REPLACE VIEW public.profiles AS SELECT * FROM public.food_passports;

-- ------------------------------------------------------------------------------
-- 5. HIDDEN GEMS SUBMISSIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hidden_gems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submitter_fingerprint TEXT NOT NULL,
    restaurant_name TEXT NOT NULL,
    neighborhood TEXT NOT NULL,
    dish_recommendation TEXT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_hidden_gems_status ON public.hidden_gems (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hidden_gems_submitter ON public.hidden_gems (submitter_fingerprint);

-- ------------------------------------------------------------------------------
-- 6. ATOMIC VOTE STORED PROCEDURE
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.cast_battle_vote(
    p_battle_id UUID,
    p_chosen_restaurant UUID,
    p_voter_fingerprint TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_battle RECORD;
    v_is_a BOOLEAN;
    v_updated_votes_a INT;
    v_updated_votes_b INT;
    v_total_votes INT;
    v_pct_a NUMERIC;
    v_pct_b NUMERIC;
    v_passport RECORD;
    v_new_dishes INT;
    v_new_restaurants INT;
    v_new_neighborhoods INT;
    v_badge_list JSONB;
BEGIN
    SELECT * INTO v_battle FROM public.battles WHERE id = p_battle_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Battle not found';
    END IF;

    IF NOT v_battle.is_active OR v_battle.ends_at < NOW() THEN
        RAISE EXCEPTION 'This battle has ended';
    END IF;

    IF p_chosen_restaurant = v_battle.restaurant_a_id THEN
        v_is_a := TRUE;
    ELSIF p_chosen_restaurant = v_battle.restaurant_b_id THEN
        v_is_a := FALSE;
    ELSE
        RAISE EXCEPTION 'Selected restaurant is not part of this battle';
    END IF;

    IF EXISTS (
        SELECT 1 FROM public.vote_logs 
        WHERE battle_id = p_battle_id AND voter_fingerprint = p_voter_fingerprint
    ) THEN
        RAISE EXCEPTION 'Already voted in this battle';
    END IF;

    INSERT INTO public.vote_logs (battle_id, voter_fingerprint, chosen_restaurant)
    VALUES (p_battle_id, p_voter_fingerprint, p_chosen_restaurant);

    IF v_is_a THEN
        UPDATE public.battles 
        SET votes_a = votes_a + 1 
        WHERE id = p_battle_id
        RETURNING votes_a, votes_b INTO v_updated_votes_a, v_updated_votes_b;
    ELSE
        UPDATE public.battles 
        SET votes_b = votes_b + 1 
        WHERE id = p_battle_id
        RETURNING votes_a, votes_b INTO v_updated_votes_a, v_updated_votes_b;
    END IF;

    v_total_votes := v_updated_votes_a + v_updated_votes_b;
    IF v_total_votes > 0 THEN
        v_pct_a := ROUND((v_updated_votes_a::NUMERIC / v_total_votes::NUMERIC) * 100, 1);
        v_pct_b := ROUND((v_updated_votes_b::NUMERIC / v_total_votes::NUMERIC) * 100, 1);
    ELSE
        v_pct_a := 50.0;
        v_pct_b := 50.0;
    END IF;

    SELECT COUNT(DISTINCT vl.battle_id),
           COUNT(DISTINCT vl.chosen_restaurant),
           COUNT(DISTINCT r.neighborhood)
    INTO v_new_dishes, v_new_restaurants, v_new_neighborhoods
    FROM public.vote_logs vl
    JOIN public.restaurants r ON r.id = vl.chosen_restaurant
    WHERE vl.voter_fingerprint = p_voter_fingerprint;

    v_badge_list := '["First Bite"]'::jsonb;
    IF v_new_dishes >= 3 THEN
        v_badge_list := v_badge_list || '["Battle Veteran"]'::jsonb;
    END IF;
    IF v_new_neighborhoods >= 2 THEN
        v_badge_list := v_badge_list || '["Navi Mumbai Explorer"]'::jsonb;
    END IF;
    IF v_new_dishes >= 5 THEN
        v_badge_list := v_badge_list || '["Palate Connoisseur"]'::jsonb;
    END IF;

    INSERT INTO public.food_passports (
        fingerprint, 
        dishes_tried_count, 
        restaurants_discovered_count, 
        neighborhoods_explored_count, 
        badges, 
        updated_at
    )
    VALUES (
        p_voter_fingerprint,
        v_new_dishes,
        v_new_restaurants,
        v_new_neighborhoods,
        v_badge_list,
        NOW()
    )
    ON CONFLICT (fingerprint) DO UPDATE SET
        dishes_tried_count = EXCLUDED.dishes_tried_count,
        restaurants_discovered_count = EXCLUDED.restaurants_discovered_count,
        neighborhoods_explored_count = EXCLUDED.neighborhoods_explored_count,
        badges = EXCLUDED.badges,
        updated_at = NOW()
    RETURNING * INTO v_passport;

    RETURN jsonb_build_object(
        'success', true,
        'votes_a', v_updated_votes_a,
        'votes_b', v_updated_votes_b,
        'total_votes', v_total_votes,
        'percent_a', v_pct_a,
        'percent_b', v_pct_b,
        'chosen_restaurant', p_chosen_restaurant,
        'passport', jsonb_build_object(
            'dishes_tried_count', v_passport.dishes_tried_count,
            'restaurants_discovered_count', v_passport.restaurants_discovered_count,
            'neighborhoods_explored_count', v_passport.neighborhoods_explored_count,
            'badges', v_passport.badges
        )
    );
END;
$$;

-- ------------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY
-- ------------------------------------------------------------------------------
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vote_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_passports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hidden_gems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read restaurants" ON public.restaurants FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public can read battles" ON public.battles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public can read approved gems" ON public.hidden_gems FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public can submit hidden gems" ON public.hidden_gems FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public can read own passport" ON public.food_passports FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public can update own passport" ON public.food_passports FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public can modify passport" ON public.food_passports FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Public can read vote logs" ON public.vote_logs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public can insert vote log" ON public.vote_logs FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 8. INITIAL SEED DATA
-- ------------------------------------------------------------------------------
INSERT INTO public.restaurants (id, name, neighborhood, image_url)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Shabari', 'Sector 17, Vashi', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80'),
    ('a0000000-0000-0000-0000-000000000002', 'Bhagat Tarachand', 'Sector 17, Vashi', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80'),
    ('a0000000-0000-0000-0000-000000000003', 'Navratna', 'Sector 17, Vashi', 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&auto=format&fit=crop&q=80'),
    ('a0000000-0000-0000-0000-000000000004', 'Mahesh Lunch Home', 'CBD Belapur', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80'),
    ('a0000000-0000-0000-0000-000000000005', 'Guru Kripa', 'Sector 19A, Nerul', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80'),
    ('a0000000-0000-0000-0000-000000000006', 'Sainath Misal', 'Sector 15, Vashi', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80'),
    ('a0000000-0000-0000-0000-000000000007', 'Yasin''s Food Inn', 'Sector 12, Kharghar', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80'),
    ('a0000000-0000-0000-0000-000000000008', 'Persian Darbar', 'Sector 19, Vashi', 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80'),
    ('a0000000-0000-0000-0000-000000000009', 'Tiwari Sweets', 'Sector 17, Vashi', 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80'),
    ('a0000000-0000-0000-0000-000000000010', 'Prashant Corner', 'Sector 20, Kharghar', 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.battles (id, title, dish_name, restaurant_a_id, restaurant_b_id, votes_a, votes_b, is_active, ends_at)
VALUES
    (
        'b0000000-0000-0000-0000-000000000001',
        'The Legendary Dal Khichdi Clash',
        'Tadka Dal Khichdi with Ghee',
        'a0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000002',
        1420,
        984,
        TRUE,
        NOW() + INTERVAL '7 days'
    ),
    (
        'b0000000-0000-0000-0000-000000000002',
        'Navi Mumbai Coastal Seafood Throne',
        'Butter Garlic Crab & Surmai Fry',
        'a0000000-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000004',
        1856,
        1520,
        TRUE,
        NOW() + INTERVAL '5 days'
    ),
    (
        'b0000000-0000-0000-0000-000000000003',
        'The Fiery Puneri Misal War',
        'Kolhapuri Spicy Tarri Misal Pav',
        'a0000000-0000-0000-0000-000000000005',
        'a0000000-0000-0000-0000-000000000006',
        1105,
        1340,
        TRUE,
        NOW() + INTERVAL '3 days'
    ),
    (
        'b0000000-0000-0000-0000-000000000004',
        'Late Night Dum Biryani Showdown',
        'Royal Mutton Dum Biryani',
        'a0000000-0000-0000-0000-000000000007',
        'a0000000-0000-0000-0000-000000000008',
        2240,
        1910,
        TRUE,
        NOW() + INTERVAL '6 days'
    ),
    (
        'b0000000-0000-0000-0000-000000000005',
        'The Sweet Tooth Championship',
        'Angoori Rasmalai & Gulab Jamun',
        'a0000000-0000-0000-0000-000000000009',
        'a0000000-0000-0000-0000-000000000010',
        890,
        960,
        TRUE,
        NOW() + INTERVAL '8 days'
    )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.hidden_gems (submitter_fingerprint, restaurant_name, neighborhood, dish_recommendation, status)
VALUES
    ('fp_seed_01', 'Darjeeling Momos Corner', 'Sector 19A, Nerul East', 'Steamed Chicken Kothey with Fire-Roasted Red Chili Chutney', 'approved'),
    ('fp_seed_02', 'Jai Bhavani Koliwada', 'CBD Belapur Artist Village', 'Crispy Bombil Fry with Garlic Green Thecha', 'approved'),
    ('fp_seed_03', 'Raju''s Secret Frankie Counter', 'Utsav Chowk, Kharghar', 'Mutton Double Egg Cheesy Frankie with Mint Chutney', 'approved')
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- 9. MONETIZATION INFRASTRUCTURE ("BUILD NOW, ACTIVATE LATER")
-- All paid features disabled by default.
-- ==============================================================================

-- 9.1 Monetization Settings & Master Feature Flags
CREATE TABLE IF NOT EXISTS public.monetization_settings (
    id INT PRIMARY KEY DEFAULT 1,
    monetization_enabled BOOLEAN DEFAULT FALSE NOT NULL,
    sponsored_battles_enabled BOOLEAN DEFAULT FALSE NOT NULL,
    champion_packages_enabled BOOLEAN DEFAULT FALSE NOT NULL,
    restaurant_offers_enabled BOOLEAN DEFAULT FALSE NOT NULL,
    brand_sponsorships_enabled BOOLEAN DEFAULT FALSE NOT NULL,
    self_service_purchasing_enabled BOOLEAN DEFAULT FALSE NOT NULL,
    paid_restaurant_dashboard_enabled BOOLEAN DEFAULT FALSE NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_by TEXT DEFAULT 'system_init' NOT NULL,
    CONSTRAINT single_row_settings CHECK (id = 1)
);

INSERT INTO public.monetization_settings (id, monetization_enabled)
VALUES (1, FALSE)
ON CONFLICT (id) DO NOTHING;

-- 9.2 Campaign Packages
CREATE TABLE IF NOT EXISTS public.campaign_packages (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('sponsored_battle', 'champion_promotion', 'brand_sponsorship')),
    name TEXT NOT NULL,
    price_in_paise BIGINT NOT NULL CHECK (price_in_paise >= 0),
    currency TEXT DEFAULT 'INR' NOT NULL,
    description TEXT,
    deliverables JSONB DEFAULT '[]'::jsonb NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    min_duration_days INT DEFAULT 3 NOT NULL
);

INSERT INTO public.campaign_packages (id, type, name, price_in_paise, description, min_duration_days)
VALUES
    ('pkg_starter_battle', 'sponsored_battle', 'Starter Sponsored Battle', 99900, 'Promote your signature dish with a sponsored matchup placement in your neighborhood node.', 3),
    ('pkg_local_spotlight', 'sponsored_battle', 'Local Spotlight Campaign', 249900, 'Featured node placement across Navi Mumbai food fights with WhatsApp share attribution.', 7),
    ('pkg_featured_campaign', 'sponsored_battle', 'Featured Arena Takeover', 499900, 'City-wide marquee promotional placement across all Navi Mumbai live food battles.', 14),
    ('pkg_champion_spotlight', 'champion_promotion', 'Champion Spotlight Package', 149900, 'Celebrate your verified victory! Valid only for restaurants that won a completed food battle.', 30),
    ('pkg_champion_feature', 'champion_promotion', 'Champion Legend Showcase', 299900, 'Full victory marketing campaign and challenger defense arena branding.', 45)
ON CONFLICT (id) DO NOTHING;

-- 9.3 Restaurant Campaigns
CREATE TABLE IF NOT EXISTS public.restaurant_campaigns (
    id TEXT PRIMARY KEY,
    restaurant_id TEXT NOT NULL,
    restaurant_name TEXT NOT NULL,
    campaign_name TEXT NOT NULL,
    package_id TEXT REFERENCES public.campaign_packages(id),
    package_name TEXT NOT NULL,
    campaign_type TEXT NOT NULL,
    related_battle_id TEXT,
    related_battle_title TEXT,
    promotional_description TEXT,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    placement_type TEXT DEFAULT 'battle_spotlight' NOT NULL,
    status TEXT DEFAULT 'pending_approval' NOT NULL CHECK (status IN ('draft', 'pending_approval', 'approved', 'scheduled', 'active', 'completed', 'rejected', 'cancelled')),
    price_in_paise BIGINT NOT NULL,
    currency TEXT DEFAULT 'INR' NOT NULL,
    payment_status TEXT DEFAULT 'pending' NOT NULL CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'pilot_waived')),
    payment_id TEXT,
    approval_status TEXT DEFAULT 'pending' NOT NULL,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    impressions INT DEFAULT 0 NOT NULL,
    clicks INT DEFAULT 0 NOT NULL,
    shares INT DEFAULT 0 NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_campaigns_restaurant ON public.restaurant_campaigns (restaurant_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.restaurant_campaigns (status);

-- 9.4 Restaurant Customer Acquisition Offers
CREATE TABLE IF NOT EXISTS public.restaurant_offers (
    id TEXT PRIMARY KEY,
    restaurant_id TEXT NOT NULL,
    restaurant_name TEXT NOT NULL,
    campaign_id TEXT REFERENCES public.restaurant_campaigns(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    discount_type TEXT DEFAULT 'flat' NOT NULL,
    discount_value NUMERIC NOT NULL,
    min_order_value NUMERIC,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    redemption_limit INT DEFAULT 100 NOT NULL,
    redemption_count INT DEFAULT 0 NOT NULL,
    redemption_method TEXT DEFAULT 'coupon_code' NOT NULL,
    coupon_code TEXT,
    status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'paused', 'expired', 'depleted')),
    terms TEXT,
    billable_fee_per_redemption_paise BIGINT DEFAULT 3000 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9.5 Verified Offer Redemptions (Anti-Fraud)
CREATE TABLE IF NOT EXISTS public.offer_redemptions (
    id TEXT PRIMARY KEY,
    offer_id TEXT NOT NULL REFERENCES public.restaurant_offers(id) ON DELETE CASCADE,
    restaurant_id TEXT NOT NULL,
    restaurant_name TEXT NOT NULL,
    consumer_fingerprint TEXT NOT NULL,
    coupon_code_used TEXT,
    billable_amount_paise BIGINT NOT NULL,
    is_billable BOOLEAN DEFAULT TRUE NOT NULL,
    billing_status TEXT DEFAULT 'unbilled' NOT NULL CHECK (billing_status IN ('unbilled', 'invoiced', 'paid', 'disputed')),
    redeemed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    verified_method TEXT DEFAULT 'code_match' NOT NULL,
    CONSTRAINT uq_offer_consumer UNIQUE (offer_id, consumer_fingerprint)
);

CREATE INDEX IF NOT EXISTS idx_redemptions_restaurant ON public.offer_redemptions (restaurant_id);

-- 9.6 Payment Records (Indian Rupee / Gateway Tracking)
CREATE TABLE IF NOT EXISTS public.payment_records (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL REFERENCES public.restaurant_campaigns(id) ON DELETE CASCADE,
    restaurant_id TEXT NOT NULL,
    amount_paise BIGINT NOT NULL,
    currency TEXT DEFAULT 'INR' NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'pilot_waived')),
    provider TEXT NOT NULL CHECK (provider IN ('razorpay', 'cashfree', 'admin_pilot')),
    provider_order_id TEXT,
    provider_payment_id TEXT,
    idempotency_key TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    notes TEXT
);

-- 9.7 Brand Sponsorships
CREATE TABLE IF NOT EXISTS public.brand_sponsorships (
    id TEXT PRIMARY KEY,
    sponsor_name TEXT NOT NULL,
    sponsor_org TEXT,
    campaign_name TEXT NOT NULL,
    description TEXT,
    placement TEXT NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    commercial_terms TEXT,
    price_in_paise BIGINT NOT NULL,
    currency TEXT DEFAULT 'INR' NOT NULL,
    status TEXT DEFAULT 'draft' NOT NULL CHECK (status IN ('draft', 'pending_approval', 'active', 'completed', 'cancelled')),
    payment_status TEXT DEFAULT 'pending' NOT NULL,
    impressions INT DEFAULT 0 NOT NULL,
    clicks INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9.8 Monetization Audit Logs
CREATE TABLE IF NOT EXISTS public.monetization_audit_logs (
    id TEXT PRIMARY KEY,
    actor TEXT NOT NULL,
    action TEXT NOT NULL,
    affected_entity TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    previous_value JSONB,
    new_value JSONB,
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_monetization_audit_timestamp ON public.monetization_audit_logs (timestamp DESC);

-- RLS FOR MONETIZATION
ALTER TABLE public.monetization_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_sponsorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monetization_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active packages" ON public.campaign_packages FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Public can read active offers" ON public.restaurant_offers FOR SELECT TO anon, authenticated USING (status = 'active');
CREATE POLICY "Public can read monetization settings" ON public.monetization_settings FOR SELECT TO anon, authenticated USING (true);
