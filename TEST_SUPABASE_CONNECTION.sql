-- ============================================
-- SUPABASE CONNECTION & USER TEST QUERIES
-- ============================================
-- Run these queries in Supabase SQL Editor to debug login issues

-- 1. CHECK IF USERS TABLE EXISTS
-- ============================================
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'users'
) as users_table_exists;

-- Expected: true


-- 2. CHECK USERS TABLE STRUCTURE
-- ============================================
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Expected columns:
-- id, email, password, name, role, created_at


-- 3. CHECK IF PASSWORD COLUMN EXISTS
-- ============================================
SELECT EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_name = 'users' 
  AND column_name = 'password'
) as password_column_exists;

-- Expected: true
-- If false, run: ALTER TABLE users ADD COLUMN password TEXT NOT NULL DEFAULT '';


-- 4. VIEW ALL USERS (Check what's in the table)
-- ============================================
SELECT id, email, password, name, role, created_at
FROM users
ORDER BY created_at DESC;

-- This shows all users in your database
-- Check: email, password, role values


-- 5. COUNT USERS BY ROLE
-- ============================================
SELECT role, COUNT(*) as count
FROM users
GROUP BY role;

-- Expected: Shows how many admins and users you have


-- 6. TEST SPECIFIC USER LOGIN (REPLACE WITH YOUR CREDENTIALS)
-- ============================================
-- Replace 'your_email@example.com' and 'your_password' with actual values
SELECT id, email, name, role
FROM users
WHERE email = 'your_email@example.com'
  AND password = 'your_password';

-- Expected: 1 row returned
-- If 0 rows: credentials don't match what's in database


-- 7. FIND USER BY EMAIL ONLY (Check what password is stored)
-- ============================================
-- Replace 'your_email@example.com' with your actual email
SELECT id, email, password, name, role
FROM users
WHERE email = 'your_email@example.com';

-- This shows what password is actually stored for this email


-- 8. CHECK FOR EXTRA SPACES IN EMAIL/PASSWORD
-- ============================================
SELECT 
  id,
  email,
  LENGTH(email) as email_length,
  password,
  LENGTH(password) as password_length,
  name,
  role
FROM users;

-- Check if length is longer than expected (indicates spaces)


-- 9. CHECK ROW LEVEL SECURITY STATUS
-- ============================================
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'attendance_records');

-- If rls_enabled = true, it might block queries
-- To disable for testing:
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;


-- 10. INSERT TEST ADMIN USER
-- ============================================
-- Use this to create a test admin account
INSERT INTO users (email, password, name, role)
VALUES ('testadmin@test.com', 'test123', 'Test Admin', 'admin')
ON CONFLICT (email) DO NOTHING
RETURNING id, email, name, role;

-- Then try logging in with:
-- Email: testadmin@test.com
-- Password: test123


-- 11. INSERT TEST REGULAR USER
-- ============================================
INSERT INTO users (email, password, name, role)
VALUES ('testuser@test.com', 'test123', 'Test User', 'user')
ON CONFLICT (email) DO NOTHING
RETURNING id, email, name, role;

-- Then try logging in with:
-- Email: testuser@test.com
-- Password: test123


-- 12. DELETE TEST USERS (Clean up after testing)
-- ============================================
-- Uncomment to delete test users
-- DELETE FROM users WHERE email IN ('testadmin@test.com', 'testuser@test.com');


-- 13. CHECK ATTENDANCE RECORDS TABLE
-- ============================================
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'attendance_records'
) as attendance_table_exists;


-- 14. VIEW ALL ATTENDANCE RECORDS
-- ============================================
SELECT 
  ar.id,
  ar.user_name,
  ar.date,
  ar.status,
  u.email as user_email,
  u.role as user_role
FROM attendance_records ar
LEFT JOIN users u ON ar.user_id = u.id
ORDER BY ar.date DESC
LIMIT 10;


-- ============================================
-- QUICK FIX: COMPLETE RESET
-- ============================================
-- If nothing works, uncomment and run this section

/*
-- Drop everything
DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Recreate users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recreate attendance_records table
CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'leave')),
  check_in_time TIME,
  check_out_time TIME,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_attendance_user_id ON attendance_records(user_id);
CREATE INDEX idx_attendance_date ON attendance_records(date);

-- Insert test admin
INSERT INTO users (email, password, name, role)
VALUES ('admin@test.com', 'admin123', 'Admin User', 'admin');

-- Insert test user
INSERT INTO users (email, password, name, role)
VALUES ('user@test.com', 'user123', 'Regular User', 'user');

-- Verify
SELECT * FROM users;
*/


-- ============================================
-- VERIFICATION CHECKLIST
-- ============================================
-- Run these queries and check results:

-- ✓ Users table exists
SELECT 'Users table exists' as check_1, COUNT(*) as user_count FROM users;

-- ✓ Password column exists
SELECT 'Password column exists' as check_2, 
       EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'password') as result;

-- ✓ At least one admin exists
SELECT 'Admin user exists' as check_3, COUNT(*) as admin_count FROM users WHERE role = 'admin';

-- ✓ RLS is disabled (for testing)
SELECT 'RLS disabled' as check_4, NOT rowsecurity as result FROM pg_tables WHERE tablename = 'users';

-- If all checks pass, login should work!

