-- ============================================================================
-- CREW DOMAINS + MEMBER PHOTOS
-- ============================================================================
-- Lets the admin dashboard place each member in a sub-team (domain) and upload
-- a photo for them. Both show on the public Crew page (/members).
--
-- Run this script once in your Supabase SQL Editor. It is safe to re-run.
-- ============================================================================

-- Step 1: New columns on users
--   domain    : which sub-team section the member appears under on /members
--   photo_url : public URL of the member's photo in the member-photos bucket
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS domain TEXT
    CHECK (domain IN ('chassis', 'suspension', 'steering', 'brakes', 'transmission', 'operations')),
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Step 2: Backfill domain for existing members from their designation text.
-- Only fills rows that don't have a domain yet, so re-running never overwrites
-- a domain picked in the dashboard.
UPDATE public.users SET domain = 'chassis'
    WHERE domain IS NULL AND (designation ILIKE '%chassis%' OR designation ILIKE '%CAE%');
UPDATE public.users SET domain = 'suspension'
    WHERE domain IS NULL AND designation ILIKE '%suspension%';
UPDATE public.users SET domain = 'steering'
    WHERE domain IS NULL AND designation ILIKE '%steering%';
UPDATE public.users SET domain = 'brakes'
    WHERE domain IS NULL AND (designation ILIKE '%brake%');
UPDATE public.users SET domain = 'transmission'
    WHERE domain IS NULL AND designation ILIKE '%transmission%';
UPDATE public.users SET domain = 'operations'
    WHERE domain IS NULL AND (designation ILIKE '%operation%' OR category = 'operations');

-- Step 3: Public storage bucket for photos.
-- 2 MB cap and image-only; the dashboard resizes photos to ~100-200 KB
-- before uploading, so the cap only stops abuse.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('member-photos', 'member-photos', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE
    SET public = EXCLUDED.public,
        file_size_limit = EXCLUDED.file_size_limit,
        allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Step 4: Storage policies for the bucket.
--
-- IMPORTANT: this site's admin login is not Supabase Auth, so the dashboard
-- uploads with the same public (anon) key as every visitor. Until login moves
-- to Supabase Auth, these policies have to allow uploads from that key, which
-- means anyone holding the public key could write to this bucket. This matches
-- how the users, notices and attendance tables are already set up.
DROP POLICY IF EXISTS "Member photos are readable" ON storage.objects;
DROP POLICY IF EXISTS "Dashboard can upload member photos" ON storage.objects;
DROP POLICY IF EXISTS "Dashboard can replace member photos" ON storage.objects;
DROP POLICY IF EXISTS "Dashboard can delete member photos" ON storage.objects;

CREATE POLICY "Member photos are readable" ON storage.objects
    FOR SELECT TO public USING (bucket_id = 'member-photos');
CREATE POLICY "Dashboard can upload member photos" ON storage.objects
    FOR INSERT TO public WITH CHECK (bucket_id = 'member-photos');
CREATE POLICY "Dashboard can replace member photos" ON storage.objects
    FOR UPDATE TO public USING (bucket_id = 'member-photos') WITH CHECK (bucket_id = 'member-photos');
CREATE POLICY "Dashboard can delete member photos" ON storage.objects
    FOR DELETE TO public USING (bucket_id = 'member-photos');

-- Step 5: Members still without a domain. They won't appear in a sub-team on
-- /members until you pick one in Admin Dashboard → Manage Team → edit.
SELECT name, email, designation, category
FROM public.users
WHERE role = 'user' AND domain IS NULL
ORDER BY name;
