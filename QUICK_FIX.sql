-- ============================================
-- QUICK FIX FOR FOREIGN KEY ERROR
-- ============================================
-- Copy and paste this entire script into Supabase SQL Editor
-- Then click "Run" or press Ctrl+Enter

-- Step 1: Check if you have any admin users
SELECT 
  'Current Admin Users:' as info,
  id,
  email,
  name,
  role
FROM users
WHERE role = 'admin';

-- If the above returns NO rows, you need to create an admin user
-- If it returns rows, note the ID and make sure you're logged in with that account


-- Step 2: Create a new admin user (if needed)
-- UNCOMMENT the lines below (remove the /* and */) and modify the values

/*
INSERT INTO users (email, password, name, role)
VALUES (
  'admin@autoarchitects.com',  -- Change to your email
  'admin123',                   -- Change to your password
  'Admin User',                 -- Change to your name
  'admin'
)
ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  name = EXCLUDED.name,
  role = EXCLUDED.role
RETURNING id, email, name, role;
*/


-- Step 3: Verify the fix
-- Run this after creating the user to confirm it exists
SELECT 
  'Verification - Admin user exists:' as status,
  id,
  email,
  name,
  role
FROM users
WHERE role = 'admin';


-- Step 4: Check for orphaned attendance records
-- This shows any attendance records created by users that don't exist
SELECT 
  'Orphaned Records (created_by user missing):' as issue,
  ar.created_by as missing_user_id,
  COUNT(*) as count
FROM attendance_records ar
LEFT JOIN users u ON ar.created_by = u.id
WHERE u.id IS NULL
GROUP BY ar.created_by;


-- Step 5: (OPTIONAL) Clean up orphaned records
-- ONLY run this if you want to delete attendance records with invalid created_by
-- UNCOMMENT the lines below to run

/*
DELETE FROM attendance_records
WHERE created_by NOT IN (SELECT id FROM users);

SELECT 'Orphaned records deleted' as status;
*/


-- ============================================
-- AFTER RUNNING THIS SCRIPT:
-- ============================================
-- 1. Note the admin user ID from Step 3
-- 2. Log out of the application
-- 3. Log back in with the email/password from Step 2
-- 4. Try saving attendance again
-- ============================================

