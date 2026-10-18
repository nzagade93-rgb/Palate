-- ==============================================================================
-- PALATE: Hyper-Local Dish-First Food Discovery Platform
-- Supabase / PostgreSQL Schema & Migration Script
-- Designed for Navi Mumbai Nodes: Vashi, Nerul, Belapur, Kharghar, Seawoods, Sanpada
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS & DOMAINS
DO $$ BEGIN
  CREATE TYPE navi_mumbai_node AS ENUM (
    'Vashi',
    'Nerul',
    'Belapur',
    'Kharghar',
    'Seawoods',
    'Sanpada'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE consensus_vote AS ENUM (
    'must_order',
    'safe_to_skip'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. RESTAURANTS / SPOTS TABLE
CREATE TABLE IF NOT EXISTS public.restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  node navi_mumbai_node NOT NULL,
  sector TEXT NOT NULL,
  address TEXT,
  landmark TEXT,
  google_maps_url TEXT,
  verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DISHES TABLE
CREATE TABLE IF NOT EXISTS public.dishes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'Main',
  is_veg BOOLEAN DEFAULT FALSE,
  price_inr INTEGER NOT NULL CHECK (price_inr >= 0),
  photo_url TEXT NOT NULL,
  must_order_count INTEGER DEFAULT 0 CHECK (must_order_count >= 0),
  skip_count INTEGER DEFAULT 0 CHECK (skip_count >= 0),
  total_votes INTEGER GENERATED ALWAYS AS (must_order_count + skip_count) STORED,
  consensus_percentage NUMERIC GENERATED ALWAYS AS (
    CASE 
      WHEN (must_order_count + skip_count) = 0 THEN 0
      ELSE ROUND((must_order_count::numeric / (must_order_count + skip_count)::numeric) * 100, 1)
    END
  ) STORED,
  highlight_quote TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DINING LOGS TABLE (Frictionless 3-Tap Logs)
CREATE TABLE IF NOT EXISTS public.dining_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dish_id UUID NOT NULL REFERENCES public.dishes(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  user_id UUID, -- NULL for anonymous community contributors
  user_handle TEXT DEFAULT 'Navi Mumbai Gourmet',
  vote consensus_vote NOT NULL,
  price_paid_inr INTEGER,
  note TEXT,
  photo_url TEXT,
  node navi_mumbai_node NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TRIGGER TO AUTO-UPDATE DISH COUNTS UPON DINING LOG ENTRY
CREATE OR REPLACE FUNCTION public.handle_dining_log_inserted()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.vote = 'must_order' THEN
    UPDATE public.dishes
    SET must_order_count = must_order_count + 1,
        updated_at = NOW()
    WHERE id = NEW.dish_id;
  ELSIF NEW.vote = 'safe_to_skip' THEN
    UPDATE public.dishes
    SET skip_count = skip_count + 1,
        updated_at = NOW()
    WHERE id = NEW.dish_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_dining_log_insert ON public.dining_logs;
CREATE TRIGGER on_dining_log_insert
  AFTER INSERT ON public.dining_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_dining_log_inserted();

-- 6. VIEWS & MATERIALIZED INSIGHTS
CREATE OR REPLACE VIEW public.dish_consensus_view AS
SELECT 
  d.id AS dish_id,
  d.name AS dish_name,
  d.category,
  d.is_veg,
  d.price_inr,
  d.photo_url,
  d.must_order_count,
  d.skip_count,
  d.total_votes,
  d.consensus_percentage,
  d.highlight_quote,
  r.id AS restaurant_id,
  r.name AS restaurant_name,
  r.node,
  r.sector,
  r.landmark,
  r.google_maps_url,
  CASE 
    WHEN d.total_votes < 3 THEN 'Forming Consensus'
    WHEN d.consensus_percentage >= 75 THEN 'Must Order'
    WHEN d.consensus_percentage <= 40 THEN 'Safe to Skip'
    ELSE 'Contested'
  END AS verdict
FROM public.dishes d
JOIN public.restaurants r ON d.restaurant_id = r.id;

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dining_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all content
CREATE POLICY "Allow public read access to restaurants"
  ON public.restaurants FOR SELECT USING (true);

CREATE POLICY "Allow public read access to dishes"
  ON public.dishes FOR SELECT USING (true);

CREATE POLICY "Allow public read access to dining logs"
  ON public.dining_logs FOR SELECT USING (true);

-- Allow public / anon users to log a dish
CREATE POLICY "Allow anon insert to dining logs"
  ON public.dining_logs FOR INSERT WITH CHECK (true);

-- Allow anon insert to dishes and restaurants when logging new entries
CREATE POLICY "Allow anon insert to restaurants"
  ON public.restaurants FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anon insert to dishes"
  ON public.dishes FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update to dish counters"
  ON public.dishes FOR UPDATE USING (true);

-- 8. SEED DATA (Authentic Navi Mumbai Culinary Landmarks)
INSERT INTO public.restaurants (id, name, node, sector, landmark, google_maps_url) VALUES
('a0000001-0000-0000-0000-000000000001', 'Bhagat Tarachand', 'Vashi', 'Sector 17', 'Near Vashi Plaza, Opposite Navratna', 'https://maps.google.com/?q=Bhagat+Tarachand+Sector+17+Vashi'),
('a0000001-0000-0000-0000-000000000002', 'Kerala Cafe', 'Kharghar', 'Sector 8', 'Near Vasundhara CHS & Jalvayu Vihar', 'https://maps.google.com/?q=Kerala+Cafe+Kharghar'),
('a0000001-0000-0000-0000-000000000003', 'Mahesh Lunch Home', 'Belapur', 'Sector 11', 'Near CBD Belapur Railway Station', 'https://maps.google.com/?q=Mahesh+Lunch+Home+CBD+Belapur'),
('a0000001-0000-0000-0000-000000000004', 'Mamledar Misal', 'Nerul', 'Sector 15', 'Near Nerul Gymkhana', 'https://maps.google.com/?q=Mamledar+Misal+Nerul'),
('a0000001-0000-0000-0000-000000000005', 'Yoko Sizzlers', 'Seawoods', 'Sector 40', 'Seawoods Grand Central Mall, Level 2', 'https://maps.google.com/?q=Yoko+Sizzlers+Seawoods+Grand+Central'),
('a0000001-0000-0000-0000-000000000006', 'Gupta Sandwich & Snacks', 'Vashi', 'Sector 9', 'Opposite Shabari, Sector 9 Market', 'https://maps.google.com/?q=Gupta+Sandwich+Sector+9+Vashi'),
('a0000001-0000-0000-0000-000000000007', 'Sai Swaad Dosa', 'Sanpada', 'Sector 4', 'Near Palm Beach Road Junction', 'https://maps.google.com/?q=Sai+Swaad+Sanpada'),
('a0000001-0000-0000-0000-000000000008', 'Utsav Fine Dine', 'Kharghar', 'Sector 20', 'Near Shilp Chowk', 'https://maps.google.com/?q=Utsav+Restaurant+Kharghar')
ON CONFLICT (id) DO NOTHING;

-- Seed Dishes
INSERT INTO public.dishes (id, restaurant_id, name, category, is_veg, price_inr, photo_url, must_order_count, skip_count, highlight_quote) VALUES
('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'Special Sev Tameta & Kutchi Chaas', 'Main', TRUE, 260, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80', 142, 6, 'Sweet, tangy tomato gravy smothered in crisp ratlami sev. Pair with chilled Kutchi beer bottle chaas.'),
('b0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000002', 'Malabar Beef Fry with Flaky Porotta', 'Main', FALSE, 340, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80', 218, 7, 'Caramelized shallots, fried coconut slivers, and slow-roasted tender meat. Absolute benchmark in Navi Mumbai.'),
('b0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000003', 'Butter Garlic Surmai & Ghee Neer Dosa', 'Seafood', FALSE, 680, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80', 189, 12, 'Thick fresh kingfish steak drenched in golden roasted garlic butter, mopped with paper-thin lace neer dosa.'),
('b0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000004', 'Kolhapuri Teekha Misal Pav', 'Breakfast & Snacks', TRUE, 120, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80', 164, 9, 'Fiery crimson kat (gravy), crunchy farsan, and pillow-soft ladi pav. Not for the faint-hearted.'),
('b0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000005', 'Yoko Special Chicken Sizzler', 'Sizzlers', FALSE, 610, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80', 97, 8, 'Hissing cast iron plate loaded with grilled chicken steak, cheese, buttered veggies, and crinkle fries.'),
('b0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000006', 'Cadbury Chocolate Toast Sandwich', 'Dessert & Snacks', TRUE, 160, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=80', 88, 11, 'Molten Dairy Milk chocolate slabs toasted inside buttered bread with grated chocolate mountain on top.'),
('b0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000007', 'Mysore Masala Dosa with Podi Butter', 'South Indian', TRUE, 130, 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=80', 112, 5, 'Golden crisp crepe coated with spicy red chutney, stuffed with spiced potato mash, served with 3 fresh chutneys.'),
('b0000001-0000-0000-0000-000000000008', 'a0000001-0000-0000-0000-000000000008', 'Truffle Oil Loaded Fries', 'Snacks', TRUE, 270, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1200&q=80', 14, 58, 'Over-salted, soggy fries soaked in artificial essence oil. Locals overwhelmingly advise skipping this.')
ON CONFLICT (id) DO NOTHING;
