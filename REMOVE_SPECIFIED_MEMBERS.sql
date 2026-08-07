-- ============================================
-- REMOVE SPECIFIED TEAM MEMBERS FROM USERS TABLE
-- ============================================
-- This script removes the specified team members from the Supabase database.
-- Run this in Supabase SQL Editor.

DELETE FROM student_registrations
WHERE email IN (
  'arjunm.kaveti@gmail.com',          -- Arjun M (Steering)
  'dhanushggowdaa@gmail.com',         -- Dhanush gowda (Steering)
  'dhanushgowdaa@gmail.com',          -- Dhanush gowda (Steering - alt email)
  'incharakswamy31@gmail.com',        -- Inchara M.K (Steering)
  'siddharth.s7060@gmail.com',        -- Siddharth S. (Steering)
  'sharadhisimhachina@gmail.com',     -- Sharadhi Simha Chi Na (Transmission)
  'dimplek5936@gmail.com',            -- Dimple K (Transmission)
  'deepakdeepuks75@gmail.com',        -- Karthik S (Transmission)
  'karthikkarthik19370@gmail.com',    -- Karthik S (Transmission - alt email)
  '1si25me409@sit.ac.in',             -- Mayur S (Suspension)
  'nikshithjagadeesh@gmail.com',      -- Nikshith J (CAE)
  'mdumarsiddiq5@gmail.com',          -- Mohammed Umar Siddi / Siddiq (CAE / Brakes)
  'yashasms9125@gmail.com'            -- Yashas M.S (CAE)
);

DELETE FROM users
WHERE email IN (
  'arjunm.kaveti@gmail.com',          -- Arjun M (Steering)
  'dhanushggowdaa@gmail.com',         -- Dhanush gowda (Steering)
  'dhanushgowdaa@gmail.com',          -- Dhanush gowda (Steering - alt email)
  'incharakswamy31@gmail.com',        -- Inchara M.K (Steering)
  'siddharth.s7060@gmail.com',        -- Siddharth S. (Steering)
  'sharadhisimhachina@gmail.com',     -- Sharadhi Simha Chi Na (Transmission)
  'dimplek5936@gmail.com',            -- Dimple K (Transmission)
  'deepakdeepuks75@gmail.com',        -- Karthik S (Transmission)
  'karthikkarthik19370@gmail.com',    -- Karthik S (Transmission - alt email)
  '1si25me409@sit.ac.in',             -- Mayur S (Suspension)
  'nikshithjagadeesh@gmail.com',      -- Nikshith J (CAE)
  'mdumarsiddiq5@gmail.com',          -- Mohammed Umar Siddi / Siddiq (CAE / Brakes)
  'yashasms9125@gmail.com'            -- Yashas M.S (CAE)
) OR name IN (
  'Arjun M',
  'ARJUN M',
  'Dhanush gowda',
  'Inchara M.K',
  'Siddharth S.',
  'Sharadhi Simha Chi Na',
  'Dimple K',
  'Karthik S',
  'KIRAN I',
  'Mayur S',
  'Nikshith J',
  'Mohammed Umar Siddi',
  'Mohammed Umar Siddiq',
  'Yashas M.S'
);
