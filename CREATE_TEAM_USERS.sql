-- ============================================
-- CREATE USER ACCOUNTS FOR ALL TEAM MEMBERS
-- ============================================
-- This script creates login accounts for all AutoArchitects ATV Club team members
-- Excludes: Captain (Kushal M.V) and Vice Captain (Tejashree P) - they are admins
-- Password: Each member's USN (University Serial Number)
-- Role: 'user' (lowercase) for all team members

-- ============================================
-- IMPORTANT NOTES:
-- ============================================
-- 1. Run this in Supabase SQL Editor
-- 2. All passwords are set to the member's USN
-- 3. Members should change their password after first login (future feature)
-- 4. Total users to be created: 32 (34 total - 2 admins excluded)
-- 5. Role is 'user' (lowercase) - case sensitive!

-- ============================================
-- INSERT TEAM MEMBER USER ACCOUNTS
-- ============================================

INSERT INTO users (email, password, name, role)
VALUES
  -- STEERING TEAM (6 members)
  ('kushalns32@gmail.com', '1SI22ME021', 'Kushal N.S', 'user'),
  ('skandaksmoudgalya@gmail.com', '1SI22ME052', 'Skanda Moudgalya KS', 'user'),
  ('siddharth.s7060@gmail.com', '1SI23ME093', 'Siddharth S.', 'user'),
  ('veereshsg14@gmail.com', '1SI23ME108', 'Veeresh', 'user'),
  ('dhanushgowdaa@gmail.com', '1SI24ME025', 'Dhanush gowda', 'user'),
  ('incharakswamy31@gmail.com', '1SI24ME039', 'Inchara M.K', 'user'),

  -- TRANSMISSION TEAM (8 members)
  ('karthikkantharaju28@gmail.com', '1SI22ME020', 'Karthik K', 'user'),

  ('darshanvaibhav2@gmail.com', '1SI23ME016', 'Darshan H.S', 'user'),
  ('sharadhisimhachina@gmail.com', '1SI23ME084', 'Sharadhi Simha Chi Na', 'user'),
  ('shivaprakashb712@gmail.com', '1SI23ME089', 'Shivaprakash H B', 'user'),
  ('dimplek5936@gmail.com', '1SI24ME028', 'Dimple K', 'user'),
  ('karthikkarthik19370@gmail.com', '1SI24ME046', 'Karthik S', 'user'),
  ('pavanshekar0206@gmail.com', '1SI24ME080', 'Pavan H.S', 'user'),

  -- SUSPENSION TEAM (6 members)
  ('likhith.785@gmail.com', '1SI22ME023', 'Likith H', 'user'),
  ('prathikjaintn12@gmail.com', '1SI23ME000', 'Prathik Jain T.N', 'user'),
  ('mithunyadavhr@gmail.com', '1SI23ME057', 'Mithan Yadav H.R', 'user'),
  ('vivek838466@gmail.com', '1SI23ME111', 'Vivek J', 'user'),
  ('jaswanthd150@gmail.com', '1SI24ME041', 'Jaswanth D.', 'user'),
  ('manojyadav.girish@gmail.com', '1SI24ME061', 'Manoj G', 'user'),

  -- BRAKES TEAM (5 members)
  ('vivekhiresomannavar@gmail.com', '1SI22ME067', 'Vivek Hiresomannavar', 'user'),
  ('basavarajarakeri@zohomail.in', '1SI24ME008', 'Basavaraj L Arakeri', 'user'),
  ('sumanthhonnungar@gmail.com', '1SI23ME100', 'Sumanth Honnungar', 'user'),
  ('kavanag720@gmail.com', '1SI24ME048', 'Kavana G', 'user'),
  ('shashi60835@gmail.com', '1SI24CH045', 'Shashi Kumar', 'user'),

  -- CAE (CHASSIS) TEAM (6 members)
  ('yashasms9125@gmail.com', '1SI23ME115', 'Yashas M.S', 'user'),
  ('dmedha2005@gmail.com', '1SI23ME055', 'Medha D.', 'user'),
  ('mdumarsiddiq5@gmail.com', '1SI23ME059', 'Mohammed Umar Siddiq', 'user'),
  ('drkamalesh397@gmail.com', '1SI23ME038', 'Kamalesh D.R', 'user'),
  ('nikshithjagadeesh@gmail.com', '1SI24ME075', 'Nikshith J', 'user'),
  ('pallavpallu806@gmail.com', '1SI24ME078', 'Pallav B', 'user'),

  -- GRAPHICS TEAM (1 member)
  ('b301898@gmail.com', '1SI24CS034', 'Bhumika B.R', 'user')

ON CONFLICT (email) DO NOTHING
RETURNING id, email, name, role;

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this after the INSERT to verify all users were created

SELECT
  'Total Users Created' as status,
  COUNT(*) as count
FROM users
WHERE role = 'user';

-- Expected: 32 users

-- ============================================
-- VIEW ALL USERS BY ROLE
-- ============================================
-- Run this to see all users organized by role

SELECT 
  role,
  COUNT(*) as count,
  STRING_AGG(name, ', ' ORDER BY name) as members
FROM users
GROUP BY role
ORDER BY role DESC;

-- Expected output:
-- role  | count | members
-- admin |   2   | Kushal M.V, Tejashree P
-- user  |  32   | Basavaraj L Arakeri, Bhumika B.R, ...

-- ============================================
-- VIEW ALL TEAM MEMBERS (USERS ONLY)
-- ============================================
-- Run this to see all team member accounts

SELECT 
  id,
  email,
  name,
  role,
  created_at
FROM users
WHERE role = 'user'
ORDER BY name;

-- ============================================
-- CREDENTIALS REFERENCE FOR TEAM MEMBERS
-- ============================================
-- Each team member can login with:
-- Email: Their email from the list above
-- Password: Their USN (University Serial Number)

-- Examples:
-- Email: kushalns32@gmail.com
-- Password: 1SI22ME021

-- Email: skandaksmoudgalya@gmail.com
-- Password: 1SI22ME052

-- Email: vivekhiresomannavar@gmail.com
-- Password: 1SI22ME067

-- ============================================
-- ADMIN ACCOUNTS (NOT CREATED BY THIS SCRIPT)
-- ============================================
-- These should be created separately with admin role:
-- 1. Kushal M.V (Captain) - kushalmvkushi2@gmail.com - USN: 1SI23ME426
-- 2. Tejashree P (Vice Captain) - tejashree62005@gmail.com - USN: 1SI22ME059

-- ============================================
-- TROUBLESHOOTING
-- ============================================

-- If you need to delete all user accounts and start over:
-- DELETE FROM users WHERE role = 'user';

-- If you need to update a specific user's password:
-- UPDATE users SET password = 'new_password' WHERE email = 'user@example.com';

-- If you need to change a user to admin:
-- UPDATE users SET role = 'admin' WHERE email = 'user@example.com';

-- ============================================
-- SECURITY NOTES
-- ============================================
-- ⚠️ IMPORTANT FOR PRODUCTION:
-- 1. These passwords (USNs) are temporary and should be changed
-- 2. Implement password hashing (bcrypt, argon2) before production
-- 3. Add password reset functionality
-- 4. Consider using Supabase Auth for better security
-- 5. Enable Row Level Security (RLS) policies

-- For development/testing, this setup is acceptable.

-- ============================================
-- SUMMARY
-- ============================================
-- Total team members: 34
-- Admin accounts: 2 (Captain, Vice Captain)
-- User accounts created: 32
-- Password format: USN (e.g., 1SI22ME021)
-- Role: 'user' (lowercase)
-- All emails are unique
-- All names match the Members page
-- Updated: 2025 - Reflects current team roster

-- Team Breakdown:
-- - Steering: 6 members
-- - Transmission: 8 members
-- - Suspension: 6 members
-- - Brakes: 5 members
-- - Chassis (CAE): 6 members
-- - Graphics: 1 member

-- ============================================
-- NEXT STEPS
-- ============================================
-- 1. Run this script in Supabase SQL Editor
-- 2. Verify 32 users were created
-- 3. Test login with a few accounts
-- 4. Share credentials with team members
-- 5. Consider implementing password change feature

-- ✅ Script ready to execute!

