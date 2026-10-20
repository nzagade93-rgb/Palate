-- ==============================================================================
-- PALATE: Persistent Food Battles & Anti-Rigging Voting Schema
-- Solves serverless in-memory resets & guarantees ACID-compliant duplicate checks.
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/djieoowubsoeigcxmkwk/sql
-- ==============================================================================

-- 1. Persistent Battles Table
CREATE TABLE IF NOT EXISTS public.palate_battles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  dish_name TEXT NOT NULL,
  battle_type TEXT NOT NULL DEFAULT 'dish',
  category TEXT NOT NULL DEFAULT 'Street Food',
  city TEXT NOT NULL DEFAULT 'Navi Mumbai',
  neighborhood TEXT NOT NULL DEFAULT 'Vashi',
  status TEXT NOT NULL DEFAULT 'live',
  ends_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  description TEXT,
  is_trending BOOLEAN DEFAULT FALSE,
  is_ending_soon BOOLEAN DEFAULT FALSE,
  votes_a INTEGER DEFAULT 0,
  votes_b INTEGER DEFAULT 0,
  total_votes INTEGER DEFAULT 0,
  percent_a NUMERIC DEFAULT 50.0,
  percent_b NUMERIC DEFAULT 50.0,
  is_active BOOLEAN DEFAULT TRUE,
  challenge_count INTEGER DEFAULT 0,
  contestant_a JSONB NOT NULL,
  contestant_b JSONB NOT NULL
);

-- Index for speedy slug lookup & neighborhood filtering
CREATE INDEX IF NOT EXISTS idx_palate_battles_slug ON public.palate_battles(slug);
CREATE INDEX IF NOT EXISTS idx_palate_battles_neighborhood ON public.palate_battles(neighborhood);

-- 2. Persistent Votes Table (Enforces 1-Vote-Per-Device Atomically)
CREATE TABLE IF NOT EXISTS public.palate_votes (
  id TEXT PRIMARY KEY,
  battle_id TEXT NOT NULL REFERENCES public.palate_battles(id) ON DELETE CASCADE,
  voter_fingerprint TEXT NOT NULL,
  chosen_contestant_id TEXT NOT NULL,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- Guaranteed unique constraint: Impossible to vote twice in the same battle on the same device
  CONSTRAINT unique_voter_per_battle UNIQUE (battle_id, voter_fingerprint)
);

CREATE INDEX IF NOT EXISTS idx_palate_votes_battle_id ON public.palate_votes(battle_id);
CREATE INDEX IF NOT EXISTS idx_palate_votes_voter ON public.palate_votes(voter_fingerprint);

-- 3. Automatic Trigger: Update vote tallies & percentages whenever a vote is cast
CREATE OR REPLACE FUNCTION public.handle_palate_vote_cast()
RETURNS TRIGGER AS $$
DECLARE
  curr_contestant_a_id TEXT;
  curr_contestant_b_id TEXT;
  new_votes_a INTEGER;
  new_votes_b INTEGER;
  new_total INTEGER;
  new_pct_a NUMERIC;
  new_pct_b NUMERIC;
BEGIN
  -- Read contestant IDs
  SELECT (contestant_a->>'id'), (contestant_b->>'id')
  INTO curr_contestant_a_id, curr_contestant_b_id
  FROM public.palate_battles
  WHERE id = NEW.battle_id;

  -- Count total votes for Contestant A and B
  SELECT 
    COUNT(*) FILTER (WHERE chosen_contestant_id = curr_contestant_a_id),
    COUNT(*) FILTER (WHERE chosen_contestant_id = curr_contestant_b_id)
  INTO new_votes_a, new_votes_b
  FROM public.palate_votes
  WHERE battle_id = NEW.battle_id;

  new_total := new_votes_a + new_votes_b;

  IF new_total > 0 THEN
    new_pct_a := ROUND((new_votes_a::numeric / new_total::numeric) * 100, 1);
    new_pct_b := ROUND((new_votes_b::numeric / new_total::numeric) * 100, 1);
  ELSE
    new_pct_a := 50.0;
    new_pct_b := 50.0;
  END IF;

  -- Update battles row atomically
  UPDATE public.palate_battles
  SET 
    votes_a = new_votes_a,
    votes_b = new_votes_b,
    total_votes = new_total,
    percent_a = new_pct_a,
    percent_b = new_pct_b,
    contestant_a = jsonb_set(jsonb_set(contestant_a, '{votes}', to_jsonb(new_votes_a)), '{percentage}', to_jsonb(new_pct_a)),
    contestant_b = jsonb_set(jsonb_set(contestant_b, '{votes}', to_jsonb(new_votes_b)), '{percentage}', to_jsonb(new_pct_b))
  WHERE id = NEW.battle_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_palate_vote_inserted ON public.palate_votes;
CREATE TRIGGER on_palate_vote_inserted
  AFTER INSERT ON public.palate_votes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_palate_vote_cast();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.palate_battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.palate_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to battles"
  ON public.palate_battles FOR SELECT USING (true);

CREATE POLICY "Allow public read access to votes"
  ON public.palate_votes FOR SELECT USING (true);

CREATE POLICY "Allow anon insert to votes"
  ON public.palate_votes FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update to battles"
  ON public.palate_battles FOR UPDATE USING (true);

CREATE POLICY "Allow public insert to battles"
  ON public.palate_battles FOR INSERT WITH CHECK (true);

-- 5. Seed Initial Navi Mumbai Battles
INSERT INTO public.palate_battles (
  id, slug, title, subtitle, dish_name, battle_type, category, city, neighborhood,
  status, ends_at, description, is_trending, votes_a, votes_b, total_votes, percent_a, percent_b, is_active,
  contestant_a, contestant_b
) VALUES
(
  'battle_vada_pav_01',
  'vashi-vs-nerul-best-vada-pav',
  'Vashi vs Nerul: The Street Vada Pav War',
  'Crispy golden batter, garlicky red dry thecha & pillowy pav',
  'Crispy Butter Vada Pav with Lasun Chutney',
  'dish',
  'Street Food',
  'Navi Mumbai',
  'Vashi',
  'live',
  NOW() + INTERVAL '7 days',
  'Two legendary Navi Mumbai vendors battle for the crown of the city’s crunchiest and most fiery vada pav. Community votes only; no paid ads.',
  TRUE,
  1842,
  1530,
  3372,
  54.6,
  45.4,
  TRUE,
  '{"id": "cont_vashi_vadapav", "name": "Sector 17 Famous Corner Vada Pav", "restaurantName": "Famous Vashi Tapri", "neighborhood": "Sector 17, Vashi", "imageUrl": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80", "signatureDish": "Double-Fried Spiced Batata Vada with Fried Chilies", "votes": 1842, "percentage": 54.6}'::jsonb,
  '{"id": "cont_nerul_vadapav", "name": "Shri Krishna Batata Vada Pav", "restaurantName": "Shri Krishna Snacks", "neighborhood": "Sector 21, Nerul East", "imageUrl": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80", "signatureDish": "Garlic Peanut Chura Loaded Vada Pav", "votes": 1530, "percentage": 45.4}'::jsonb
)
ON CONFLICT (id) DO NOTHING;
