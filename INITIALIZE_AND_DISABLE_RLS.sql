-- ============================================================================
-- INITIALIZE COLUMNS AND DISABLE RLS FOR ALL TABLES
-- ============================================================================
-- Run this script in your Supabase SQL Editor:
-- https://sawvlnfvcnotntgwieiz.supabase.co
-- ============================================================================

-- Step 1: Add member details columns to users table (if missing)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS designation TEXT DEFAULT 'Team Member',
ADD COLUMN IF NOT EXISTS year TEXT DEFAULT '1st Year',
ADD COLUMN IF NOT EXISTS major TEXT DEFAULT 'Mechanical Engineering',
ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'technical' CHECK (category IN ('leadership', 'technical', 'operations'));

-- Step 2: Disable Row Level Security (RLS) completely (Recommended for development)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices DISABLE ROW LEVEL SECURITY;

-- Step 3: Create fallback public policies (in case Supabase overrides DISABLE RLS)
DROP POLICY IF EXISTS "Allow public insert for users" ON public.users;
DROP POLICY IF EXISTS "Allow public select for users" ON public.users;
DROP POLICY IF EXISTS "Allow public update for users" ON public.users;
DROP POLICY IF EXISTS "Allow public delete for users" ON public.users;

DROP POLICY IF EXISTS "Allow public insert for attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Allow public select for attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Allow public update for attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Allow public delete for attendance" ON public.attendance_records;

DROP POLICY IF EXISTS "Allow public insert for leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Allow public select for leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Allow public update for leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Allow public delete for leave requests" ON public.leave_requests;

DROP POLICY IF EXISTS "Allow public insert for notices" ON public.notices;
DROP POLICY IF EXISTS "Allow public select for notices" ON public.notices;
DROP POLICY IF EXISTS "Allow public update for notices" ON public.notices;
DROP POLICY IF EXISTS "Allow public delete for notices" ON public.notices;

-- Enable public access on users
CREATE POLICY "Allow public insert for users" ON public.users FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public select for users" ON public.users FOR SELECT TO public USING (true);
CREATE POLICY "Allow public update for users" ON public.users FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete for users" ON public.users FOR DELETE TO public USING (true);

-- Enable public access on attendance_records
CREATE POLICY "Allow public insert for attendance" ON public.attendance_records FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public select for attendance" ON public.attendance_records FOR SELECT TO public USING (true);
CREATE POLICY "Allow public update for attendance" ON public.attendance_records FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete for attendance" ON public.attendance_records FOR DELETE TO public USING (true);

-- Enable public access on leave_requests
CREATE POLICY "Allow public insert for leave requests" ON public.leave_requests FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public select for leave requests" ON public.leave_requests FOR SELECT TO public USING (true);
CREATE POLICY "Allow public update for leave requests" ON public.leave_requests FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete for leave requests" ON public.leave_requests FOR DELETE TO public USING (true);

-- Enable public access on notices
CREATE POLICY "Allow public insert for notices" ON public.notices FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public select for notices" ON public.notices FOR SELECT TO public USING (true);
CREATE POLICY "Allow public update for notices" ON public.notices FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete for notices" ON public.notices FOR DELETE TO public USING (true);

-- Step 4: Verification message
SELECT 'All tables updated, RLS disabled, and fallback policies configured successfully!' as status;
