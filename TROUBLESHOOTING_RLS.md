# Troubleshooting: RLS Policy Violation Error

## 🔴 Error Message

```
new row violates row level security policy for table 'student_registrations'
```

## 🔍 Root Cause

The Row Level Security (RLS) policy is blocking the INSERT operation because:

1. **Wrong Role Used**: The original policy used `TO public` but Supabase uses the `anon` role for unauthenticated requests
2. **Missing Policy**: No policy exists that allows the `anon` role to INSERT data
3. **RLS Enabled Without Proper Policies**: RLS is enabled but doesn't have a policy for anonymous users

## ✅ Solution

### ⚠️ IMPORTANT: Policy Already Exists Error?

If you get an error like:
```
ERROR: 42710: policy "Allow anonymous insert for registrations" for table "student_registrations" already exists
```

**Use the `RESET_RLS_POLICIES.sql` file instead!** It drops ALL possible policy names (both old and new) before creating them.

### Quick Fix (Run this SQL in Supabase SQL Editor)

**Use this script - it handles existing policies correctly:**

```sql
-- Drop ALL possible policy names (old and new)
DROP POLICY IF EXISTS "Allow public insert for registrations" ON public.student_registrations;
DROP POLICY IF EXISTS "Allow admin select for registrations" ON public.student_registrations;
DROP POLICY IF EXISTS "Allow admin update for registrations" ON public.student_registrations;
DROP POLICY IF EXISTS "Allow admin delete for registrations" ON public.student_registrations;
DROP POLICY IF EXISTS "Allow anonymous insert for registrations" ON public.student_registrations;
DROP POLICY IF EXISTS "Allow authenticated insert for registrations" ON public.student_registrations;
DROP POLICY IF EXISTS "Allow authenticated select for registrations" ON public.student_registrations;
DROP POLICY IF EXISTS "Allow authenticated update for registrations" ON public.student_registrations;
DROP POLICY IF EXISTS "Allow authenticated delete for registrations" ON public.student_registrations;

-- Enable RLS
ALTER TABLE public.student_registrations ENABLE ROW LEVEL SECURITY;

-- Create the CORRECT policies
CREATE POLICY "Allow anonymous insert for registrations"
ON public.student_registrations
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow authenticated insert for registrations"
ON public.student_registrations
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated select for registrations"
ON public.student_registrations
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated update for registrations"
ON public.student_registrations
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated delete for registrations"
ON public.student_registrations
FOR DELETE
TO authenticated
USING (true);
```

### Complete Fix (Recommended)

Use the `RESET_RLS_POLICIES.sql` file which includes all necessary policies and verification:

1. Go to Supabase Dashboard → SQL Editor
2. Open `RESET_RLS_POLICIES.sql` from your project
3. Copy and paste the entire content
4. Click **Run**
5. Check the verification output at the bottom

## 🧪 Verify the Fix

### Method 1: Check Policies in Supabase Dashboard

1. Go to **Database** → **Tables** → `student_registrations`
2. Click on **Policies** tab
3. You should see these policies:
   - ✅ `Allow anonymous insert for registrations` (INSERT, anon)
   - ✅ `Allow authenticated insert for registrations` (INSERT, authenticated)
   - ✅ `Allow authenticated select for registrations` (SELECT, authenticated)
   - ✅ `Allow authenticated update for registrations` (UPDATE, authenticated)
   - ✅ `Allow authenticated delete for registrations` (DELETE, authenticated)

### Method 2: Run Verification SQL

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'student_registrations';
-- Expected: rowsecurity = true

-- List all policies
SELECT policyname, roles, cmd
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'student_registrations';
-- Expected: 5 policies listed
```

### Method 3: Test the Registration Form

1. Open your app: `http://localhost:8082/`
2. Click "Join Team" button
3. Fill out the registration form
4. Click "Submit Registration"
5. ✅ Should see success message
6. ❌ Should NOT see RLS error

## 📊 Understanding Supabase Roles

| Role | Description | Used For |
|------|-------------|----------|
| `anon` | Anonymous/unauthenticated users | Public registration form |
| `authenticated` | Logged-in users | Admin dashboard |
| `public` | ❌ NOT used by Supabase | Don't use this! |

**Key Point:** When you use the Supabase client from the frontend without authentication, it uses the `anon` role, NOT the `public` role.

## 🔧 Common Mistakes

### ❌ Mistake 1: Using `TO public`
```sql
-- WRONG - This doesn't work with Supabase!
CREATE POLICY "Allow public insert"
ON student_registrations
FOR INSERT
TO public  -- ❌ Wrong role!
WITH CHECK (true);
```

### ✅ Correct: Using `TO anon`
```sql
-- CORRECT - This works with Supabase!
CREATE POLICY "Allow anonymous insert"
ON student_registrations
FOR INSERT
TO anon  -- ✅ Correct role!
WITH CHECK (true);
```

### ❌ Mistake 2: Forgetting to Enable RLS
```sql
-- Make sure RLS is enabled
ALTER TABLE student_registrations ENABLE ROW LEVEL SECURITY;
```

### ❌ Mistake 3: No INSERT Policy for Anonymous Users
If you only have policies for `authenticated` users, anonymous users can't insert data.

## 🎯 Testing Checklist

After applying the fix:

- [ ] Run the SQL script in Supabase SQL Editor
- [ ] Verify policies exist in Supabase Dashboard
- [ ] Test registration form submission (should work)
- [ ] Check Supabase Table Editor (should see new entry)
- [ ] Test admin dashboard (should see registrations)
- [ ] Check browser console (should have no errors)

## 🚨 Still Getting Errors?

### Error: "policy already exists"
**Root Cause:** The `DROP POLICY IF EXISTS` statements used the OLD policy names, but the policies that exist have the NEW names.

**Why this happens:**
- Original guide had policies named "Allow public insert for registrations"
- Fixed guide has policies named "Allow anonymous insert for registrations"
- If you ran the fixed guide first, the DROP statements in the original guide won't find anything to drop
- Then when you try to CREATE, it fails because the policy already exists

**Solution:** Use `RESET_RLS_POLICIES.sql` which drops BOTH old and new policy names.

### Error: "permission denied for table student_registrations"
**Solution:** Make sure the table is in the `public` schema and RLS is enabled.

### Error: "relation 'student_registrations' does not exist"
**Solution:** Create the table first using the SQL in `SUPABASE_SETUP_GUIDE.md`.

### Error: "duplicate key value violates unique constraint"
**Solution:** This is a different error - check if you're trying to insert duplicate data.

### Error: "null value in column violates not-null constraint"
**Solution:** Make sure all required fields are filled in the form.

## 📞 Additional Help

If you're still having issues:

1. **Check Browser Console:**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for Supabase error messages
   - Copy the full error message

2. **Check Supabase Logs:**
   - Go to Supabase Dashboard → Logs
   - Look for failed INSERT operations
   - Check the error details

3. **Verify Supabase Client:**
   - Make sure `src/lib/supabase.ts` has correct URL and anon key
   - Check that the client is initialized properly

## 🎉 Success Indicators

You'll know it's working when:

1. ✅ Registration form submits without errors
2. ✅ Success toast notification appears
3. ✅ New entry appears in Supabase Table Editor
4. ✅ Admin dashboard shows the new registration
5. ✅ No errors in browser console

---

**The fix is simple: Use `TO anon` instead of `TO public` in your RLS policies!** 🚀

