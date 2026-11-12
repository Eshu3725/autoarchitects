-- ============================================================================
-- SPONSORS + LOGOS
-- ============================================================================
-- Sponsors managed from Admin Dashboard → Sponsors & Logos (/admin/partners)
-- and shown on the public Sponsors page as a scrolling logo strip plus a list
-- grouped by tier.
--
-- Run this script once in your Supabase SQL Editor. It is safe to re-run.
-- ============================================================================

-- Step 1: Table
CREATE TABLE IF NOT EXISTS public.sponsors (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
    tier          TEXT NOT NULL DEFAULT 'associate'
                  CHECK (tier IN ('title', 'major', 'associate', 'manufacturing', 'technical', 'media', 'workshop', 'co-sponsor')),
    logo_url      TEXT CHECK (char_length(logo_url) <= 500),
    website       TEXT CHECK (char_length(website) <= 300 AND website ~* '^https?://'),
    since         TEXT CHECK (char_length(since) <= 40),   -- e.g. "2024" or "2019 – 2023"
    is_visible    BOOLEAN NOT NULL DEFAULT true,           -- hidden sponsors stay in the dashboard only
    display_order INTEGER NOT NULL DEFAULT 0,              -- order within a tier
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at    TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_sponsors_order ON public.sponsors(tier, display_order);

-- Step 2: Seed with the partners already listed on the site (only when the
-- table is empty), so the admin just has to upload their logos.
INSERT INTO public.sponsors (name, tier, display_order)
SELECT v.name, v.tier, v.ord
FROM (VALUES
    ('Siddaganga Institute of Technology',        'title',         1),
    ('AICTE',                                     'major',         2),
    ('AICTE IDEA Lab',                            'major',         3),
    ('Burnout by 3 Brothers Machination Pvt Ltd', 'manufacturing', 4),
    ('SOLIDWORKS',                                'technical',     5),
    ('Ansys',                                     'technical',     6),
    ('Altair',                                    'technical',     7),
    ('Lotus Engineering',                         'technical',     8),
    ('Inner Wheel',                               'co-sponsor',    9),
    ('Gosala Ventures',                           'co-sponsor',   10)
) AS v(name, tier, ord)
WHERE NOT EXISTS (SELECT 1 FROM public.sponsors);

-- Step 3: Row Level Security
--
-- IMPORTANT: this site's admin login is not Supabase Auth, so the dashboard
-- talks to the database with the same public (anon) key as every visitor.
-- Until login moves to Supabase Auth, writes must stay open for the dashboard
-- to work, which means anyone holding the public key could edit this table.
-- This matches the users, notices and attendance tables today.
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Sponsors are public" ON public.sponsors;
DROP POLICY IF EXISTS "Dashboard can add sponsors" ON public.sponsors;
DROP POLICY IF EXISTS "Dashboard can update sponsors" ON public.sponsors;
DROP POLICY IF EXISTS "Dashboard can delete sponsors" ON public.sponsors;

CREATE POLICY "Sponsors are public" ON public.sponsors
    FOR SELECT TO public USING (true);
CREATE POLICY "Dashboard can add sponsors" ON public.sponsors
    FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Dashboard can update sponsors" ON public.sponsors
    FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Dashboard can delete sponsors" ON public.sponsors
    FOR DELETE TO public USING (true);

-- Step 4: Public storage bucket for logos.
-- The dashboard converts every logo (including SVG) to PNG before upload, so
-- only raster types are accepted here.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('sponsor-logos', 'sponsor-logos', true, 2097152, ARRAY['image/png', 'image/webp', 'image/jpeg'])
ON CONFLICT (id) DO UPDATE
    SET public = EXCLUDED.public,
        file_size_limit = EXCLUDED.file_size_limit,
        allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Step 5: Storage policies (same caveat as Step 3)
DROP POLICY IF EXISTS "Sponsor logos are readable" ON storage.objects;
DROP POLICY IF EXISTS "Dashboard can upload sponsor logos" ON storage.objects;
DROP POLICY IF EXISTS "Dashboard can replace sponsor logos" ON storage.objects;
DROP POLICY IF EXISTS "Dashboard can delete sponsor logos" ON storage.objects;

CREATE POLICY "Sponsor logos are readable" ON storage.objects
    FOR SELECT TO public USING (bucket_id = 'sponsor-logos');
CREATE POLICY "Dashboard can upload sponsor logos" ON storage.objects
    FOR INSERT TO public WITH CHECK (bucket_id = 'sponsor-logos');
CREATE POLICY "Dashboard can replace sponsor logos" ON storage.objects
    FOR UPDATE TO public USING (bucket_id = 'sponsor-logos') WITH CHECK (bucket_id = 'sponsor-logos');
CREATE POLICY "Dashboard can delete sponsor logos" ON storage.objects
    FOR DELETE TO public USING (bucket_id = 'sponsor-logos');

SELECT 'Table public.sponsors and bucket sponsor-logos are ready!' AS status;
