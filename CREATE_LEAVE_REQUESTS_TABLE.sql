-- ============================================================================
-- CREATE LEAVE REQUESTS TABLE
-- ============================================================================
-- Run this script in your Supabase SQL Editor:
-- https://sawvlnfvcnotntgwieiz.supabase.co
-- ============================================================================

-- Step 1: Create Table
CREATE TABLE IF NOT EXISTS public.leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    date DATE NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    reviewed_by UUID REFERENCES public.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Step 2: Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_leave_requests_user_id ON public.leave_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_date ON public.leave_requests(date);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON public.leave_requests(status);

-- Step 3: Disable Row Level Security (RLS) to match development configurations
ALTER TABLE public.leave_requests DISABLE ROW LEVEL SECURITY;

-- Step 4: Verification message
SELECT 'Table public.leave_requests created successfully!' as status;
