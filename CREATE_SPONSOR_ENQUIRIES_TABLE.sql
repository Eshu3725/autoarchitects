-- ============================================================================
-- CREATE SPONSOR ENQUIRIES TABLE
-- ============================================================================
-- Stores submissions from the sponsorship form on /sponsors.
-- Admins review them at /admin/sponsors.
--
-- Run this script once in your Supabase SQL Editor.
-- ============================================================================

-- Step 1: Create table. CHECK constraints cap field sizes so the public form
-- can't be used to dump large payloads into the database.
CREATE TABLE IF NOT EXISTS public.sponsor_enquiries (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enquirer_type TEXT NOT NULL CHECK (enquirer_type IN ('company', 'individual', 'alumni', 'member')),
    organisation  TEXT CHECK (char_length(organisation) <= 200),
    contact_name  TEXT NOT NULL CHECK (char_length(contact_name) BETWEEN 1 AND 120),
    designation   TEXT CHECK (char_length(designation) <= 120),
    email         TEXT NOT NULL CHECK (char_length(email) <= 200 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
    phone         TEXT NOT NULL CHECK (char_length(phone) BETWEEN 7 AND 20),
    website       TEXT CHECK (char_length(website) <= 300),
    tier          TEXT NOT NULL CHECK (tier IN ('title', 'major', 'associate', 'technical', 'workshop', 'media', 'undecided')),
    support_type  TEXT NOT NULL CHECK (support_type IN ('monetary', 'in_kind', 'both')),
    message       TEXT CHECK (char_length(message) <= 2000),
    referred_by   TEXT CHECK (char_length(referred_by) <= 120),
    status        TEXT NOT NULL DEFAULT 'New'
                  CHECK (status IN ('New', 'Contacted', 'In discussion', 'Confirmed', 'Declined')),
    admin_notes   TEXT CHECK (char_length(admin_notes) <= 4000),
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at    TIMESTAMP WITH TIME ZONE
);

-- Step 2: Indexes for the admin list
CREATE INDEX IF NOT EXISTS idx_sponsor_enquiries_created_at ON public.sponsor_enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sponsor_enquiries_status ON public.sponsor_enquiries(status);

-- Step 3: Row Level Security
-- Public visitors may only INSERT a fresh enquiry (status 'New', no admin notes).
--
-- IMPORTANT: this site's admin login is not Supabase Auth, so the admin
-- dashboard talks to the database with the same public (anon) key as every
-- visitor. Until login moves to Supabase Auth, SELECT/UPDATE/DELETE must stay
-- open for the dashboard to work, which means anyone holding the public key
-- can read these rows. This matches student_registrations and notices today.
ALTER TABLE public.sponsor_enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit sponsor enquiries" ON public.sponsor_enquiries;
DROP POLICY IF EXISTS "Dashboard can read sponsor enquiries" ON public.sponsor_enquiries;
DROP POLICY IF EXISTS "Dashboard can update sponsor enquiries" ON public.sponsor_enquiries;
DROP POLICY IF EXISTS "Dashboard can delete sponsor enquiries" ON public.sponsor_enquiries;

CREATE POLICY "Public can submit sponsor enquiries" ON public.sponsor_enquiries
    FOR INSERT TO public
    WITH CHECK (status = 'New' AND admin_notes IS NULL AND updated_at IS NULL);
CREATE POLICY "Dashboard can read sponsor enquiries" ON public.sponsor_enquiries
    FOR SELECT TO public USING (true);
CREATE POLICY "Dashboard can update sponsor enquiries" ON public.sponsor_enquiries
    FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Dashboard can delete sponsor enquiries" ON public.sponsor_enquiries
    FOR DELETE TO public USING (true);

-- Step 4: Live updates, so new enquiries appear on the dashboard without a refresh
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'sponsor_enquiries'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.sponsor_enquiries;
    END IF;
END $$;

-- Step 5: Verification message
SELECT 'Table public.sponsor_enquiries created successfully!' AS status;
