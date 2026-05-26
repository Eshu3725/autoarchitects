-- ====================================================
-- ADD MEMBER DETAIL COLUMNS TO USERS TABLE
-- ====================================================
-- Run this in your Supabase SQL Editor: https://sawvlnfvcnotntgwieiz.supabase.co
-- This script adds the columns required for the Members page:
-- 1. designation (e.g., Steering, Captain)
-- 2. year (e.g., 4th Year)
-- 3. major (e.g., Mechanical Engineering)
-- 4. bio (e.g., USN)
-- 5. category (leadership, technical, operations)

-- 1. Alter Table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS designation TEXT DEFAULT 'Team Member',
ADD COLUMN IF NOT EXISTS year TEXT DEFAULT '1st Year',
ADD COLUMN IF NOT EXISTS major TEXT DEFAULT 'Mechanical Engineering',
ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'technical' CHECK (category IN ('leadership', 'technical', 'operations'));

-- 2. Migrate Existing Users
-- Update Captain (Kushal M.V)
UPDATE users 
SET designation = 'Captain (Steering)', year = '4th Year', major = 'Mechanical Engineering', bio = 'USN: 1SI23ME426', category = 'leadership'
WHERE email = 'kushalmvkushi2@gmail.com';

-- Update Vice Captain (Tejashree P)
UPDATE users 
SET designation = 'Vice Captain (Chassis) CAE', year = '4th Year', major = 'Mechanical Engineering', bio = 'USN: 1SI22ME059', category = 'leadership'
WHERE email = 'tejashree62005@gmail.com';

-- Update Eshaan AV (Digital)
UPDATE users 
SET designation = 'Digital', year = '3rd Year', major = 'Artificial Intelligence and Data Science', bio = 'USN: 1SI23AD011', category = 'operations'
WHERE email = 'eshaanvenkatesh3725@gmail.com';

-- Update Bhumika B.R (Graphics)
UPDATE users 
SET designation = 'Graphics', year = '2nd Year', major = 'Computer Science and Engineering', bio = 'USN: 1SI24CS034', category = 'operations'
WHERE email = 'b301898@gmail.com';

-- Steering Team
UPDATE users 
SET designation = 'Steering', year = '4th Year', major = 'Mechanical Engineering', bio = 'USN: 1SI22ME021', category = 'technical'
WHERE email = 'kushalns32@gmail.com';

UPDATE users 
SET designation = 'Steering', year = '4th Year', major = 'Mechanical Engineering', bio = 'USN: 1SI22ME052', category = 'technical'
WHERE email = 'skandaksmoudgalya@gmail.com';

UPDATE users 
SET designation = 'Steering', year = '3rd Year', major = 'Mechanical Engineering', bio = 'USN: 1SI23ME093', category = 'technical'
WHERE email = 'siddharth.s7060@gmail.com';

UPDATE users 
SET designation = 'Steering', year = '3rd Year', major = 'Mechanical Engineering', bio = 'USN: 1SI23ME108', category = 'technical'
WHERE email = 'veereshsg14@gmail.com';

UPDATE users 
SET designation = 'Steering', year = '2nd Year', major = 'Mechanical Engineering', bio = 'USN: 1SI24ME025', category = 'technical'
WHERE email IN ('dhanushgowdaa@gmail.com', 'dhanushggowdaa@gmail.com');

UPDATE users 
SET designation = 'Steering', year = '2nd Year', major = 'Mechanical Engineering', bio = 'USN: 1SI24ME039', category = 'technical'
WHERE email = 'incharakswamy31@gmail.com';

-- Transmission Team
UPDATE users 
SET designation = 'Transmission', year = '4th Year', major = 'Mechanical Engineering', bio = 'USN: 1SI22ME020', category = 'technical'
WHERE email = 'karthikkantharaju28@gmail.com';


UPDATE users 
SET designation = 'Captain (Transmission)', year = '3rd Year', major = 'Mechanical Engineering', bio = 'USN: 1SI23ME016', category = 'leadership'
WHERE email = 'darshanvaibhav2@gmail.com';

UPDATE users 
SET designation = 'Transmission', year = '3rd Year', major = 'Mechanical Engineering', bio = 'USN: 1SI23ME084', category = 'technical'
WHERE email = 'sharadhisimhachina@gmail.com';

UPDATE users 
SET designation = 'Transmission', year = '3rd Year', major = 'Mechanical Engineering', bio = 'USN: 1SI23ME089', category = 'technical'
WHERE email = 'shivaprakashb712@gmail.com';

UPDATE users 
SET designation = 'Transmission', year = '2nd Year', major = 'Mechanical Engineering', bio = 'USN: 1SI24ME028', category = 'technical'
WHERE email = 'dimplek5936@gmail.com';

UPDATE users 
SET designation = 'Transmission', year = '2nd Year', major = 'Mechanical Engineering', bio = 'USN: 1SI24ME046', category = 'technical'
WHERE email IN ('karthikkarthi19370@gmail.com', 'karthikkarthik19370@gmail.com');

UPDATE users 
SET designation = 'Transmission', year = '2nd Year', major = 'Mechanical Engineering', bio = 'USN: 1SI24ME080', category = 'technical'
WHERE email = 'pavanshekar0206@gmail.com';

-- Suspension Team
UPDATE users 
SET designation = 'Suspension', year = '4th Year', major = 'Mechanical Engineering', bio = 'USN: 1SI22ME023', category = 'technical'
WHERE email = 'likhith.785@gmail.com';

UPDATE users 
SET designation = 'Suspension', year = '3rd Year', major = 'Mechanical Engineering', bio = 'USN: 1SI23ME070', category = 'technical'
WHERE email IN ('prathikjaintn21@gmail.com', 'prathikjaintn12@gmail.com');

UPDATE users 
SET designation = 'Vice Captain (Suspension)', year = '3rd Year', major = 'Mechanical Engineering', bio = 'USN: 1SI23ME057', category = 'leadership'
WHERE email = 'mithunyadavhr@gmail.com';

UPDATE users 
SET designation = 'Suspension', year = '3rd Year', major = 'Mechanical Engineering', bio = 'USN: 1SI23ME111', category = 'technical'
WHERE email IN ('vivek8884168@gmail.com', 'vivek838466@gmail.com');

UPDATE users 
SET designation = 'Suspension', year = '2nd Year', major = 'Mechanical Engineering', bio = 'USN: 1SI24ME041', category = 'technical'
WHERE email = 'jaswanthd150@gmail.com';

UPDATE users 
SET designation = 'Suspension', year = '2nd Year', major = 'Mechanical Engineering', bio = 'USN: 1SI24ME061', category = 'technical'
WHERE email = 'manojyadav.girish@gmail.com';

-- Brakes Team
UPDATE users 
SET designation = 'Brakes', year = '4th Year', major = 'Mechanical Engineering', bio = 'USN: 1SI22ME067', category = 'technical'
WHERE email = 'vivekhiresomannavar@gmail.com';

UPDATE users 
SET designation = 'Brakes', year = '4th Year', major = 'Mechanical Engineering', bio = 'USN: 1SI22ME008', category = 'technical'
WHERE email = 'basavarajarakeri@zohomail.in';

UPDATE users 
SET designation = 'Brakes', year = '3rd Year', major = 'Mechanical Engineering', bio = 'USN: 1SI23ME100', category = 'technical'
WHERE email = 'sumanthhonnungar@gmail.com';

UPDATE users 
SET designation = 'Brakes', year = '2nd Year', major = 'Mechanical Engineering', bio = 'USN: 1SI24ME048', category = 'technical'
WHERE email = 'kavanag720@gmail.com';

UPDATE users 
SET designation = 'Brakes', year = '2nd Year', major = 'Chemical Engineering', bio = 'USN: 1SI24CH045', category = 'technical'
WHERE email = 'shashi60835@gmail.com';

-- Chassis (CAE) Team
UPDATE users 
SET designation = 'Chassis (CAE)', year = '3rd Year', major = 'Mechanical Engineering', bio = 'USN: 1SI23ME115', category = 'technical'
WHERE email = 'yashasms9125@gmail.com';

UPDATE users 
SET designation = 'Chassis (CAE)', year = '3rd Year', major = 'Mechanical Engineering', bio = 'USN: 1SI23ME055', category = 'technical'
WHERE email = 'dmedha2005@gmail.com';

UPDATE users 
SET designation = 'Chassis (CAE)', year = '3rd Year', major = 'Mechanical Engineering', bio = 'USN: 1SI23ME059', category = 'technical'
WHERE email = 'mdumarsiddiq5@gmail.com';

UPDATE users 
SET designation = 'Chassis (CAE)', year = '3rd Year', major = 'Mechanical Engineering', bio = 'USN: 1SI23ME038', category = 'technical'
WHERE email = 'drkamalesh397@gmail.com';

UPDATE users 
SET designation = 'Chassis (CAE)', year = '2nd Year', major = 'Mechanical Engineering', bio = 'USN: 1SI24ME075', category = 'technical'
WHERE email = 'nikshithjagadeesh@gmail.com';

UPDATE users 
SET designation = 'Chassis (CAE)', year = '2nd Year', major = 'Mechanical Engineering', bio = 'USN: 1SI24ME078', category = 'technical'
WHERE email = 'pallavpallu806@gmail.com';

SELECT 'Columns added and data migrated successfully!' as status;
