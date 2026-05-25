-- ============================================================================
-- CREATE NOTICES TABLE
-- ============================================================================
-- Run this script in your Supabase SQL Editor:
-- https://sawvlnfvcnotntgwieiz.supabase.co
-- ============================================================================

-- Step 1: Create Table
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    file_name TEXT,
    file_type TEXT,
    file_data TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- Step 2: Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_notices_created_at ON public.notices(created_at DESC);

-- Step 3: Disable Row Level Security (RLS) to match development configurations
ALTER TABLE public.notices DISABLE ROW LEVEL SECURITY;

-- Step 4: Create universal public policies (fallback if RLS is forced)
DROP POLICY IF EXISTS "Allow public insert for notices" ON public.notices;
DROP POLICY IF EXISTS "Allow public select for notices" ON public.notices;
DROP POLICY IF EXISTS "Allow public update for notices" ON public.notices;
DROP POLICY IF EXISTS "Allow public delete for notices" ON public.notices;

CREATE POLICY "Allow public insert for notices" ON public.notices FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public select for notices" ON public.notices FOR SELECT TO public USING (true);
CREATE POLICY "Allow public update for notices" ON public.notices FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete for notices" ON public.notices FOR DELETE TO public USING (true);

-- Step 5: Verification message
SELECT 'Table public.notices created successfully!' as status;
