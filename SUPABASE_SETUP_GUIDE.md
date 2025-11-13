# Supabase Setup Guide - Student Registration System

This guide will help you set up Supabase for the student registration system.

## 📋 Prerequisites

- A Supabase account (sign up at https://supabase.com if you don't have one)
- Your Supabase project is already created (URL: https://sawvlnfvcnotntgwieiz.supabase.co)

## 🗄️ Database Setup

### Step 1: Create the `student_registrations` Table

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the following SQL:

```sql
-- Create student_registrations table
CREATE TABLE IF NOT EXISTS public.student_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  usn TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  role_interested TEXT NOT NULL,
  part_of_other_club TEXT NOT NULL CHECK (part_of_other_club IN ('yes', 'no')),
  other_club_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  status TEXT DEFAULT 'Pending' NOT NULL CHECK (status IN ('Pending', 'Approved', 'Rejected'))
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_student_registrations_status ON public.student_registrations(status);
CREATE INDEX IF NOT EXISTS idx_student_registrations_created_at ON public.student_registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_student_registrations_role ON public.student_registrations(role_interested);

-- Add comment to table
COMMENT ON TABLE public.student_registrations IS 'Stores student registration applications for the ATV club';
```

6. Click **Run** to execute the SQL

### Step 2: Set Up Row Level Security (RLS)

RLS ensures that only authorized users can access the data.

**IMPORTANT:** Use the `FIX_RLS_POLICIES.sql` file for the correct policies!

The key issue is that Supabase uses the `anon` role for unauthenticated requests, not `public`.

**Quick Fix - Run this SQL:**

```sql
-- Drop any existing policies
DROP POLICY IF EXISTS "Allow public insert for registrations" ON public.student_registrations;
DROP POLICY IF EXISTS "Allow admin select for registrations" ON public.student_registrations;
DROP POLICY IF EXISTS "Allow admin update for registrations" ON public.student_registrations;
DROP POLICY IF EXISTS "Allow admin delete for registrations" ON public.student_registrations;

-- Enable RLS
ALTER TABLE public.student_registrations ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow ANONYMOUS users to INSERT (submit registrations)
-- CRITICAL: Use "anon" role, not "public" role!
CREATE POLICY "Allow anonymous insert for registrations"
ON public.student_registrations
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy 2: Allow AUTHENTICATED users to INSERT (backup)
CREATE POLICY "Allow authenticated insert for registrations"
ON public.student_registrations
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 3: Allow AUTHENTICATED users to SELECT all records
CREATE POLICY "Allow authenticated select for registrations"
ON public.student_registrations
FOR SELECT
TO authenticated
USING (true);

-- Policy 4: Allow AUTHENTICATED users to UPDATE records
CREATE POLICY "Allow authenticated update for registrations"
ON public.student_registrations
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy 5: Allow AUTHENTICATED users to DELETE records
CREATE POLICY "Allow authenticated delete for registrations"
ON public.student_registrations
FOR DELETE
TO authenticated
USING (true);
```

**Why this works:**
- `TO anon` - Allows unauthenticated users (the public registration form)
- `TO authenticated` - Allows logged-in users (admin dashboard)
- The original `TO public` doesn't work with Supabase's authentication system

### Step 3: Enable Realtime (Optional but Recommended)

To enable real-time updates on the admin dashboard:

1. Go to **Database** → **Replication** in the Supabase Dashboard
2. Find the `student_registrations` table
3. Toggle **Enable Realtime** to ON

This will allow the admin dashboard to automatically update when new registrations are submitted.

## 🔑 Environment Variables

Your Supabase credentials are already configured in `src/lib/supabase.ts`:

- **Supabase URL**: `https://sawvlnfvcnotntgwieiz.supabase.co`
- **Anon Key**: Already configured in the code

**Note**: The credentials are currently hardcoded. For production, you should move them to environment variables:

1. Create a `.env` file in the root directory (copy from `.env.example`)
2. Add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://sawvlnfvcnotntgwieiz.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```
3. Update `src/lib/supabase.ts` to use environment variables:
   ```typescript
   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
   ```

## 📦 Install Dependencies

The Supabase client is already installed. If you need to reinstall:

```bash
npm install @supabase/supabase-js
```

EmailJS has been removed from the project:

```bash
npm uninstall @emailjs/browser
```

## 🧪 Testing the Setup

### Test 1: Submit a Registration

1. Start your development server: `npm run dev`
2. Navigate to the home page
3. Click the "Join Team" button
4. Fill out the registration form
5. Submit the form
6. Check the Supabase Dashboard → **Table Editor** → `student_registrations` to see the new entry

### Test 2: View Registrations in Admin Dashboard

1. Log in as an admin user
2. Navigate to `/admin/registrations`
3. You should see all submitted registrations
4. Try filtering, searching, and updating status

### Test 3: Real-time Updates

1. Open the admin dashboard in one browser tab
2. Submit a new registration in another tab
3. The admin dashboard should automatically update with the new registration (if realtime is enabled)

## 🎯 Features Implemented

✅ **Student Registration Form**
- Saves data to Supabase instead of sending emails
- All form validation remains unchanged
- Success/error toast notifications

✅ **Admin Dashboard** (`/admin/registrations`)
- View all registrations in a table
- Search by name, USN, or email
- Filter by status (Pending/Approved/Rejected)
- Filter by role
- Update status with dropdown
- View detailed information in a modal
- Delete registrations
- Export to CSV
- Real-time updates when new registrations are submitted
- Statistics cards showing total, pending, approved, and rejected counts

✅ **Security**
- Row Level Security (RLS) policies
- Public can only INSERT (submit registrations)
- Only authenticated admin users can SELECT, UPDATE, DELETE
- Protected routes for admin dashboard

## 🚀 Next Steps

1. ✅ Run the SQL scripts above to create the table and set up RLS
2. ✅ Enable Realtime for the table (optional)
3. ✅ Test the registration form
4. ✅ Test the admin dashboard
5. ✅ Verify real-time updates work

## 📝 Notes

- The old EmailJS integration has been completely removed
- All existing form validation and UI remain unchanged
- The admin dashboard uses the same design system (Racing Red #E60012, glassmorphism)
- The existing admin authentication system is used (no new login pages created)

## ❓ Troubleshooting

**Issue**: "Failed to load registrations" error
- **Solution**: Check that RLS policies are set up correctly and you're logged in as an admin

**Issue**: Can't submit registration
- **Solution**: Check that the public INSERT policy is enabled

**Issue**: Real-time updates not working
- **Solution**: Enable Realtime for the `student_registrations` table in Supabase Dashboard

**Issue**: Environment variables not working
- **Solution**: Make sure `.env` file is in the root directory and restart the dev server

