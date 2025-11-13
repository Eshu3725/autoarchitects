-- ============================================================================
-- FIX RLS POLICIES FOR STUDENT REGISTRATIONS
-- ============================================================================
-- This script fixes the Row Level Security policies to allow public registration
-- submissions while protecting admin operations.
--
-- ISSUE: The original policy used "TO public" which doesn't work with Supabase
-- SOLUTION: Use "TO anon" for public access and "TO authenticated" for admin access
-- ============================================================================

-- Step 1: Drop existing policies (if any)
DROP POLICY IF EXISTS "Allow public insert for registrations" ON public.student_registrations;
DROP POLICY IF EXISTS "Allow admin select for registrations" ON public.student_registrations;
DROP POLICY IF EXISTS "Allow admin update for registrations" ON public.student_registrations;
DROP POLICY IF EXISTS "Allow admin delete for registrations" ON public.student_registrations;

-- Step 2: Ensure RLS is enabled
ALTER TABLE public.student_registrations ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLICY 1: Allow ANONYMOUS users to INSERT (submit registrations)
-- ============================================================================
-- This allows anyone to submit a registration from the public form
-- Uses "anon" role which is what Supabase client uses for unauthenticated requests
CREATE POLICY "Allow anonymous insert for registrations"
ON public.student_registrations
FOR INSERT
TO anon
WITH CHECK (true);

-- ============================================================================
-- POLICY 2: Allow AUTHENTICATED users to INSERT (backup policy)
-- ============================================================================
-- This allows authenticated users to also submit registrations
CREATE POLICY "Allow authenticated insert for registrations"
ON public.student_registrations
FOR INSERT
TO authenticated
WITH CHECK (true);

-- ============================================================================
-- POLICY 3: Allow AUTHENTICATED admin users to SELECT all records
-- ============================================================================
-- This allows admins to view all registrations in the dashboard
-- Note: Adjust the admin check based on your auth setup
CREATE POLICY "Allow authenticated select for registrations"
ON public.student_registrations
FOR SELECT
TO authenticated
USING (true);
-- If you want to restrict to admin role only, replace "USING (true)" with:
-- USING (
--   auth.jwt() ->> 'role' = 'admin'
--   OR
--   (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
-- );

-- ============================================================================
-- POLICY 4: Allow AUTHENTICATED admin users to UPDATE records
-- ============================================================================
-- This allows admins to change status (Pending/Approved/Rejected)
CREATE POLICY "Allow authenticated update for registrations"
ON public.student_registrations
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
-- If you want to restrict to admin role only, replace with:
-- USING (
--   auth.jwt() ->> 'role' = 'admin'
--   OR
--   (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
-- )
-- WITH CHECK (
--   auth.jwt() ->> 'role' = 'admin'
--   OR
--   (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
-- );

-- ============================================================================
-- POLICY 5: Allow AUTHENTICATED admin users to DELETE records
-- ============================================================================
-- This allows admins to delete registrations if needed
CREATE POLICY "Allow authenticated delete for registrations"
ON public.student_registrations
FOR DELETE
TO authenticated
USING (true);
-- If you want to restrict to admin role only, replace "USING (true)" with:
-- USING (
--   auth.jwt() ->> 'role' = 'admin'
--   OR
--   (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
-- );

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these queries to verify the policies are set up correctly:

-- 1. Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'student_registrations';
-- Expected: rowsecurity = true

-- 2. List all policies on the table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'student_registrations';
-- Expected: 5 policies (1 anon insert, 1 authenticated insert, 1 select, 1 update, 1 delete)

-- ============================================================================
-- TESTING
-- ============================================================================
-- After running this script:
-- 1. Try submitting a registration from the public form (should work)
-- 2. Log in as admin and view the dashboard (should see all registrations)
-- 3. Try updating a registration status (should work)
-- 4. Try deleting a registration (should work)

-- ============================================================================
-- NOTES
-- ============================================================================
-- - The policies use "TO anon" for public access (unauthenticated users)
-- - The policies use "TO authenticated" for logged-in users
-- - Currently, all authenticated users have full access (SELECT, UPDATE, DELETE)
-- - If you want to restrict to admin role only, uncomment the role checks
-- - The "anon" role is what Supabase uses for unauthenticated API requests
-- ============================================================================

