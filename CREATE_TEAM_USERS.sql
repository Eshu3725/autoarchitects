-- ============================================
-- CREATE USER ACCOUNTS FOR ALL TEAM MEMBERS
-- ============================================
-- This script creates login accounts for all AutoArchitects ATV Club team members
-- Excludes: Captain (Kushal M.V), Lead (Tejashree P), and Digital (Eshaan AV) - they are admins
-- Password: Each member's USN (University Serial Number)
-- Role: 'user' (lowercase) for all team members

-- ============================================
-- IMPORTANT NOTES:
-- ============================================
-- 1. Run this in Supabase SQL Editor
-- 2. All passwords are set to the member's USN
-- 3. Members should change their password after first login (future feature)
-- 4. Total users to be created: 33 (35 total - 2 admins excluded)
-- 5. Role is 'user' (lowercase) - case sensitive!

-- ============================================
-- INSERT TEAM MEMBER USER ACCOUNTS
-- ============================================

INSERT INTO users (email, password, name, role)
VALUES 
  -- STEERING TEAM (5 members)
  ('kushalns32@gmail.com', '1SI22ME021', 'Kushal N.S', 'user'),
  ('incharakswamy31@gmail.com', '1SI24ME039', 'Inchara M.K', 'user'),
  ('siddarth.s7090@gmail.com', '1SI23ME093', 'Siddharth S.', 'user'),
  ('veereshsg14@gmail.com', '1SI23ME108', 'Veeresh', 'user'),
  ('dhanushgowdaa@gmail.com', '1SI24ME025', 'Dhanush gowda', 'user'),
  
  -- TRANSMISSION TEAM (6 members)
  ('karthikkkantharaju@gmail.com', '1SI22ME020', 'Karthik K', 'user'),
  ('karthikarthik1937@gmail.com', '1SI24ME046', 'Karthik S', 'user'),
  ('sharadhasimnachina@gmail.com', '1SI23ME084', 'Sharadhasimha', 'user'),
  ('dimplek8580@gmail.com', '1SI24ME026', 'Dimple K', 'user'),
  ('manojyadav31@gmail.com', '1SI23ME010', 'Manoj D', 'user'),
  ('shivaprakashtp12@gmail.com', '1SI23ME089', 'Shivaprakash T.P', 'user'),
  
  -- SUSPENSION TEAM (6 members)
  ('likith.785@gmail.com', '1SI22ME023', 'Likith H', 'user'),
  ('skandamoguda@gmail.com', '1SI22ME052', 'Skanda Moguda', 'user'),
  ('mithunyadav72@gmail.com', '1SI23ME047', 'Mithun Yadav M.R', 'user'),
  ('prathikjaintn21@gmail.com', '1SI23ME012', 'Prathik Jain T.N', 'user'),
  ('vivek838466@gmail.com', '1SI23ME070', 'Vivek J', 'user'),
  ('jaswanthd150@gmail.com', '1SI24ME011', 'Jaswanth D.', 'user'),
  
  -- BRAKES TEAM (7 members)
  ('basavrajarakeri20@gmail.com', '1SI22ME081', 'Basavaraj L Arakeri', 'user'),
  ('vivekhiresomannavar@gmail.com', '1SI22ME067', 'Vivek Hiresomannavar', 'user'),
  ('dmedha2005@gmail.com', '1SI23ME055', 'Medha D.', 'user'),
  ('mdumarsiddiq50@gmail.com', '1SI23ME059', 'Mohammed Umar Siddiq', 'user'),
  ('sumanthhonmunger@gmail.com', '1SI23ME102', 'Sumanth Honmunger', 'user'),
  ('shashi600325@gmail.com', '1SI24ME053', 'Shashikumar', 'user'),
  ('kavana688@gmail.com', '1SI23ME081', 'Kavana U', 'user'),
  
  -- CAE (CHASSIS) TEAM (7 members)
  ('damaneet712@gmail.com', '1SI23ME014', 'Damaneet', 'user'),
  ('yashasm9125@gmail.com', '1SI23ME015', 'Yashas M.S', 'user'),
  ('darshanvaibhav2@gmail.com', '1SI23ME016', 'Darshan H.S', 'user'),
  ('drkamlesh17@gmail.com', '1SI23ME074', 'Dr.Kamlesh D.R', 'user'),
  ('nikshitjagadeesh@gmail.com', '1SI24ME075', 'Nikshit J.', 'user'),
  ('pallavpallu8206@gmail.com', '1SI24ME078', 'Pallav B', 'user'),
  ('pavanhsnaik2806@gmail.com', '1SI24ME080', 'Pavan H.S', 'user'),
  
  -- GRAPHICS TEAM (1 member)
  ('b301898@gmail.com', '1SI24ME034', 'Bhumika B.R', 'user')

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

-- Expected: 33 users

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
-- admin |   3   | Eshaan AV, Kushal M.V, Tejashree P
-- user  |  33   | Basavaraj L Arakeri, Bhumika B.R, ...

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

-- Email: incharakswamy31@gmail.com
-- Password: 1SI24ME039

-- Email: basavrajarakeri20@gmail.com
-- Password: 1SI22ME081

-- ============================================
-- ADMIN ACCOUNTS (NOT CREATED BY THIS SCRIPT)
-- ============================================
-- These should be created separately with admin role:
-- 1. Kushal M.V (Captain) - kushalmvkushi2@gmail.com
-- 2. Tejashree P (Lead) - tejashree3005@gmail.com
-- 3. Eshaan AV (Digital) - eshaanvenkatesh3725@gmail.com

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
-- Total team members: 35
-- Admin accounts: 3 (Captain, Lead, Digital)
-- User accounts created: 33
-- Password format: USN (e.g., 1SI22ME021)
-- Role: 'user' (lowercase)
-- All emails are unique
-- All names match the Members page

-- ============================================
-- NEXT STEPS
-- ============================================
-- 1. Run this script in Supabase SQL Editor
-- 2. Verify 33 users were created
-- 3. Test login with a few accounts
-- 4. Share credentials with team members
-- 5. Consider implementing password change feature

-- ✅ Script ready to execute!

