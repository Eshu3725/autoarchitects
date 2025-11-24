-- ============================================
-- DIAGNOSTIC SCRIPT FOR USER ID MISMATCH
-- ============================================
-- Run this in Supabase SQL Editor to diagnose the foreign key issue

-- 1. CHECK ALL USERS IN DATABASE
-- ============================================
SELECT 
  id,
  email,
  name,
  role,
  created_at
FROM users
ORDER BY role DESC, name;

-- Expected output: List of all users with their IDs
-- Look for the admin user you're logged in as


-- 2. CHECK IF THERE ARE ANY USERS AT ALL
-- ============================================
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
  COUNT(CASE WHEN role = 'user' THEN 1 END) as user_count
FROM users;

-- Expected output: Should show at least 1 admin user


-- 3. CHECK RECENT ATTENDANCE RECORDS (if any exist)
-- ============================================
SELECT 
  ar.id,
  ar.user_id,
  ar.user_name,
  ar.date,
  ar.status,
  ar.created_by,
  u.email as created_by_email,
  u.name as created_by_name
FROM attendance_records ar
LEFT JOIN users u ON ar.created_by = u.id
ORDER BY ar.created_at DESC
LIMIT 10;

-- Expected output: Recent attendance records with creator info
-- If created_by_email is NULL, it means the created_by user doesn't exist


-- 4. FIND ORPHANED ATTENDANCE RECORDS (created_by user doesn't exist)
-- ============================================
SELECT 
  ar.id,
  ar.created_by as missing_user_id,
  ar.user_name,
  ar.date,
  COUNT(*) as count
FROM attendance_records ar
LEFT JOIN users u ON ar.created_by = u.id
WHERE u.id IS NULL
GROUP BY ar.created_by, ar.id, ar.user_name, ar.date
ORDER BY count DESC;

-- Expected output: Any records where created_by doesn't match a user
-- This will show you which user IDs are missing


-- 5. CHECK FOR DUPLICATE ATTENDANCE RECORDS
-- ============================================
SELECT 
  user_id,
  date,
  COUNT(*) as duplicate_count
FROM attendance_records
GROUP BY user_id, date
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- Expected output: Any duplicate records (same user, same date)


-- ============================================
-- SOLUTIONS BASED ON FINDINGS
-- ============================================

-- SOLUTION 1: If you have NO admin users in the database
-- Run this to create an admin user (replace with your details):
/*
INSERT INTO users (email, password, name, role)
VALUES (
  'admin@autoarchitects.com',
  'admin123',  -- Change this to your password
  'Admin User',
  'admin'
)
RETURNING id, email, name, role;
*/

-- SOLUTION 2: If you have admin users but the ID doesn't match
-- First, find your admin user ID from query #1 above
-- Then, log out and log back in with that admin account
-- The login will store the correct ID in localStorage


-- SOLUTION 3: If you want to add a specific user with a specific ID
-- (Only use this if you know the exact UUID you need)
/*
INSERT INTO users (id, email, password, name, role)
VALUES (
  'YOUR-UUID-HERE',  -- Replace with the UUID from your auth context
  'admin@autoarchitects.com',
  'admin123',
  'Admin User',
  'admin'
)
ON CONFLICT (id) DO NOTHING
RETURNING id, email, name, role;
*/


-- SOLUTION 4: Clean up orphaned attendance records
-- (Only run this if you want to delete records with invalid created_by)
/*
DELETE FROM attendance_records
WHERE created_by NOT IN (SELECT id FROM users);
*/


-- ============================================
-- VERIFICATION AFTER FIX
-- ============================================
-- After applying a solution, run this to verify:
/*
SELECT 
  'Users Table' as table_name,
  COUNT(*) as record_count
FROM users
UNION ALL
SELECT 
  'Attendance Records' as table_name,
  COUNT(*) as record_count
FROM attendance_records
UNION ALL
SELECT 
  'Valid Attendance Records' as table_name,
  COUNT(*) as record_count
FROM attendance_records ar
INNER JOIN users u ON ar.created_by = u.id;
*/

