-- ============================================================================
-- RESET AND FIX RLS POLICIES - GUARANTEED TO WORK
-- ============================================================================
-- This script drops ALL possible policy names (old and new) before creating
-- the correct policies. Run this in Supabase SQL Editor.
-- ============================================================================

-- Step 1: Drop ALL possible policy names (both old and new)
-- This ensures a clean slate regardless of what policies exist

-- Drop OLD policy names (from original guide)
DROP POLICY IF EXISTS "Allow public insert for registrations" ON public.student_registrations;
DROP POLICY IF EXISTS "Allow admin select for registrations" ON public.student_registrations;
DROP POLICY IF EXISTS "Allow admin update for registrations" ON public.student_registrations;
DROP POLICY IF EXISTS "Allow admin delete for registrations" ON public.student_registrations;

-- Drop NEW policy names (in case they were already created)
DROP POLICY IF EXISTS "Allow anonymous insert for registrations" ON public.student_registrations;
DROP POLICY IF EXISTS "Allow authenticated insert for registrations" ON public.student_registrations;
DROP POLICY IF EXISTS "Allow authenticated select for registrations" ON public.student_registrations;
DROP POLICY IF EXISTS "Allow authenticated update for registrations" ON public.student_registrations;
DROP POLICY IF EXISTS "Allow authenticated delete for registrations" ON public.student_registrations;

-- Step 2: Ensure RLS is enabled
ALTER TABLE public.student_registrations ENABLE ROW LEVEL SECURITY;

-- Step 3: Create the CORRECT policies with proper roles

-- ============================================================================
-- POLICY 1: Allow ANONYMOUS users to INSERT (submit registrations)
-- ============================================================================
-- CRITICAL: Uses "anon" role (what Supabase uses for unauthenticated requests)
CREATE POLICY "Allow anonymous insert for registrations"
ON public.student_registrations
FOR INSERT
TO anon
WITH CHECK (true);

-- ============================================================================
-- POLICY 2: Allow AUTHENTICATED users to INSERT (backup)
-- ============================================================================
-- Allows logged-in users to also submit registrations
CREATE POLICY "Allow authenticated insert for registrations"
ON public.student_registrations
FOR INSERT
TO authenticated
WITH CHECK (true);

-- ============================================================================
-- POLICY 3: Allow AUTHENTICATED users to SELECT all records
-- ============================================================================
-- Allows admins to view all registrations in the dashboard
CREATE POLICY "Allow authenticated select for registrations"
ON public.student_registrations
FOR SELECT
TO authenticated
USING (true);

-- ============================================================================
-- POLICY 4: Allow AUTHENTICATED users to UPDATE records
-- ============================================================================
-- Allows admins to change status (Pending/Approved/Rejected)
CREATE POLICY "Allow authenticated update for registrations"
ON public.student_registrations
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================================================
-- POLICY 5: Allow AUTHENTICATED users to DELETE records
-- ============================================================================
-- Allows admins to delete registrations if needed
CREATE POLICY "Allow authenticated delete for registrations"
ON public.student_registrations
FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- VERIFICATION: Check that all policies were created successfully
-- ============================================================================

-- This query shows all policies on the table
SELECT 
    policyname as "Policy Name",
    roles as "Role",
    cmd as "Command",
    qual as "USING Expression",
    with_check as "WITH CHECK Expression"
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename = 'student_registrations'
ORDER BY cmd, policyname;

-- Expected output: 5 policies
-- 1. Allow authenticated delete for registrations | {authenticated} | DELETE
-- 2. Allow anonymous insert for registrations     | {anon}          | INSERT
-- 3. Allow authenticated insert for registrations | {authenticated} | INSERT
-- 4. Allow authenticated select for registrations | {authenticated} | SELECT
-- 5. Allow authenticated update for registrations | {authenticated} | UPDATE

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
-- If you see 5 policies listed above, the setup is complete!
-- Now test your registration form - it should work without RLS errors.
-- ============================================================================

