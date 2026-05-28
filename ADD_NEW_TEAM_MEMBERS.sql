-- ============================================================
-- ADD NEW TEAM MEMBERS TO USERS TABLE
-- ============================================================
-- This script inserts 6 new team members into the users table
-- Run this in Supabase SQL Editor
-- ============================================================

-- Insert all 6 new team members
INSERT INTO users (email, password, name, role, designation, year, major, category, bio)
VALUES
  -- 1. ARJUN M - Steering Team
  (
    'arjunm.kaveti@gmail.com',
    'member123',
    'ARJUN M',
    'user',
    'Steering Team',
    '2nd Year',
    'Mechanical Engineering',
    'technical',
    'USN: 1SI24ME011'
  ),
  
  -- 2. Karthik S - Transmission Team (UPDATE existing if needed)
  -- Note: This member already exists, only update email if needed
  -- (
  --   'deepakdeepuks75@gmail.com',
  --   'member123',
  --   'Karthik S',
  --   'user',
  --   'Transmission Team',
  --   '2nd Year',
  --   'Mechanical Engineering',
  --   'technical',
  --   'USN: 1SI24ME046'
  -- ),
  
  -- 3. Gowtham Gowda S - Brakes Team
  (
    'gowthamgowda8261@gmail.com',
    'member123',
    'Gowtham Gowda S',
    'user',
    'Brakes Team',
    '1st Year',
    'Mechanical Engineering',
    'technical',
    'USN: 1SI25ME038'
  ),
  
  -- 4. Bhavana R - Transmission Team
  (
    'bhavana.feb14@gmail.com',
    'member123',
    'Bhavana R',
    'user',
    'Transmission Team',
    '1st Year',
    'Mechanical Engineering',
    'technical',
    'USN: 1SI25ME020'
  ),
  
  -- 5. Bhumika B R - Transmission Team (moved from Graphics)
  -- Note: This member may already exist in Graphics, update designation
  -- (
  --   'b301898@gmail.com',
  --   'member123',
  --   'Bhumika B R',
  --   'user',
  --   'Transmission Team',
  --   '2nd Year',
  --   'Computer Science and Engineering',
  --   'technical',
  --   'USN: 1SI24CS034'
  -- ),
  
  -- 6. Mayur S - Suspension Team
  (
    '1si25me409@sit.ac.in',
    'member123',
    'Mayur S',
    'user',
    'Suspension Team',
    '2nd Year',
    'Mechanical Engineering',
    'technical',
    'USN: 1SI25ME409'
  );

-- ============================================================
-- UPDATE EXISTING MEMBERS (if they exist in database)
-- ============================================================

-- Update Karthik S's email if he exists in the database
UPDATE users
SET email = 'deepakdeepuks75@gmail.com'
WHERE name = 'Karthik S' 
  AND bio = 'USN: 1SI24ME046';

-- Update Bhumika B R's designation from Graphics to Transmission if she exists
UPDATE users
SET designation = 'Transmission Team',
    category = 'technical'
WHERE email = 'b301898@gmail.com'
  AND name LIKE 'Bhumika%';

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- 1. Check if all new members are inserted
SELECT name, email, designation, year, major, category
FROM users
WHERE email IN (
  'arjunm.kaveti@gmail.com',
  'deepakdeepuks75@gmail.com',
  'gowthamgowda8261@gmail.com',
  'bhavana.feb14@gmail.com',
  'b301898@gmail.com',
  '1si25me409@sit.ac.in'
)
ORDER BY designation, name;

-- 2. Count total users
SELECT COUNT(*) as total_users FROM users WHERE role = 'user';

-- 3. Show members by team
SELECT designation, COUNT(*) as member_count
FROM users
WHERE role = 'user'
GROUP BY designation
ORDER BY designation;
