-- ============================================================================
-- FIX RLS POLICIES FOR LEAVE REQUESTS
-- ============================================================================
-- Run this script in your Supabase SQL Editor:
-- https://sawvlnfvcnotntgwieiz.supabase.co
-- ============================================================================

-- Step 1: Disable Row Level Security (RLS) completely (Recommended for development)
ALTER TABLE public.leave_requests DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing policies (if any)
DROP POLICY IF EXISTS "Allow authenticated insert for leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Allow authenticated select for leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Allow authenticated update for leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Allow authenticated delete for leave requests" ON public.leave_requests;

DROP POLICY IF EXISTS "Allow public insert for leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Allow public select for leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Allow public update for leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Allow public delete for leave requests" ON public.leave_requests;

-- Step 3: Create universal public policies
-- (In case your Supabase project forces RLS and overrides the DISABLE command)
CREATE POLICY "Allow public insert for leave requests" 
ON public.leave_requests 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow public select for leave requests" 
ON public.leave_requests 
FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow public update for leave requests" 
ON public.leave_requests 
FOR UPDATE 
TO public 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow public delete for leave requests" 
ON public.leave_requests 
FOR DELETE 
TO public 
USING (true);

-- Step 4: Verification message
SELECT 'Leave requests RLS fixed successfully (disabled RLS & added public policies)!' as status;
