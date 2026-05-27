-- ============================================
-- REMOVE ALL 4TH YEAR STUDENTS FROM SYSTEM
-- ============================================
-- This script permanently removes all 4th-year students from the database
-- Run this in Supabase SQL Editor

-- IMPORTANT: This action is PERMANENT and CANNOT be undone!
-- Make sure you have a backup before proceeding.

-- ============================================
-- STEP 1: IDENTIFY 4TH YEAR STUDENTS
-- ============================================

-- List all 4th year students based on email addresses from Members.tsx
-- These emails correspond to students with year: "4th Year"

SELECT 
  'BEFORE DELETION - 4th Year Students:' as status,
  id,
  email,
  name,
  role,
  created_at
FROM users
WHERE email IN (
  'kushalmvkushi2@gmail.com',          -- Kushal M.V - Steering (4th Year)
  'tejashree62005@gmail.com',          -- Tejashree P - Chassis CAE (4th Year)
  'kushalns32@gmail.com',              -- Kushal N.S - Steering (4th Year)
  'skandaksmoudgalya@gmail.com',       -- Skanda Moudgalya KS - Steering (4th Year)
  'karthikkantharaju28@gmail.com',     -- Karthik K - Transmission (4th Year)
  'likhith.785@gmail.com',             -- Likith H - Suspension (4th Year)
  'vivekhiresomannavar@gmail.com',     -- Vivek Hiresomannavar - Brakes (4th Year)
  'basavarajarakeri@zohomail.in'       -- Basavaraj L Arakeri - Brakes (4th Year)
)
ORDER BY name;

-- ============================================
-- STEP 2: CHECK ATTENDANCE RECORDS COUNT
-- ============================================

SELECT 
  'ATTENDANCE RECORDS TO BE DELETED:' as info,
  COUNT(*) as total_records
FROM attendance_records
WHERE user_id IN (
  SELECT id FROM users WHERE email IN (
    'kushalmvkushi2@gmail.com',
    'tejashree62005@gmail.com',
    'kushalns32@gmail.com',
    'skandaksmoudgalya@gmail.com',
    'karthikkantharaju28@gmail.com',
    'likhith.785@gmail.com',
    'vivekhiresomannavar@gmail.com',
    'basavarajarakeri@zohomail.in'
  )
);

-- ============================================
-- STEP 3: CHECK REGISTRATION RECORDS COUNT
-- ============================================

SELECT 
  'REGISTRATION RECORDS TO BE DELETED:' as info,
  COUNT(*) as total_records
FROM student_registrations
WHERE email IN (
  'kushalmvkushi2@gmail.com',
  'tejashree62005@gmail.com',
  'kushalns32@gmail.com',
  'skandaksmoudgalya@gmail.com',
  'karthikkantharaju28@gmail.com',
  'likhith.785@gmail.com',
  'vivekhiresomannavar@gmail.com',
  'basavarajarakeri@zohomail.in'
);

-- ============================================
-- STEP 4: DELETE FROM STUDENT REGISTRATIONS
-- ============================================
-- This removes any registration applications

DELETE FROM student_registrations
WHERE email IN (
  'kushalmvkushi2@gmail.com',
  'tejashree62005@gmail.com',
  'kushalns32@gmail.com',
  'skandaksmoudgalya@gmail.com',
  'karthikkantharaju28@gmail.com',
  'likhith.785@gmail.com',
  'vivekhiresomannavar@gmail.com',
  'basavarajarakeri@zohomail.in'
);

SELECT 'Student registrations deleted' as status;

-- ============================================
-- STEP 5: DELETE FROM USERS TABLE
-- ============================================
-- This will CASCADE DELETE all attendance_records automatically
-- due to the ON DELETE CASCADE constraint

DELETE FROM users
WHERE email IN (
  'kushalmvkushi2@gmail.com',          -- Kushal M.V
  'tejashree62005@gmail.com',          -- Tejashree P
  'kushalns32@gmail.com',              -- Kushal N.S
  'skandaksmoudgalya@gmail.com',       -- Skanda Moudgalya KS
  'karthikkantharaju28@gmail.com',     -- Karthik K
  'likhith.785@gmail.com',             -- Likith H
  'vivekhiresomannavar@gmail.com',     -- Vivek Hiresomannavar
  'basavarajarakeri@zohomail.in'       -- Basavaraj L Arakeri
);

SELECT '4th Year students deleted from users table' as status;

-- ============================================
-- STEP 6: VERIFICATION
-- ============================================

-- Check that users are deleted
SELECT 
  'AFTER DELETION - Remaining Users:' as status,
  COUNT(*) as total_users,
  COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
  COUNT(CASE WHEN role = 'user' THEN 1 END) as user_count
FROM users;

-- Verify no 4th year students remain
SELECT 
  'VERIFICATION - Should be ZERO:' as status,
  COUNT(*) as remaining_4th_year_students
FROM users
WHERE email IN (
  'kushalmvkushi2@gmail.com',
  'tejashree62005@gmail.com',
  'kushalns32@gmail.com',
  'skandaksmoudgalya@gmail.com',
  'karthikkantharaju28@gmail.com',
  'likhith.785@gmail.com',
  'vivekhiresomannavar@gmail.com',
  'basavarajarakeri@zohomail.in'
);

-- List remaining users
SELECT 
  'REMAINING USERS:' as info,
  id,
  email,
  name,
  role
FROM users
ORDER BY role DESC, name;
