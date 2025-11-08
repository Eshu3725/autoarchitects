# 🚀 Complete Supabase Setup - From Start to Finish

**Follow this guide step-by-step to set up your Attendance Management System with Supabase.**

⏱️ **Time Required:** 10 minutes  
📍 **Your Supabase Project:** https://sawvlnfvcnotntgwieiz.supabase.co

---

## 📋 What We'll Do

1. ✅ Create database tables
2. ✅ Add your first admin user
3. ✅ Add team members (regular users)
4. ✅ Test the login
5. ✅ Verify everything works

---

## 🎯 Step 1: Open Supabase SQL Editor

### 1.1 Go to Your Supabase Project

1. Open your browser
2. Navigate to: **https://sawvlnfvcnotntgwieiz.supabase.co**
3. Login if prompted

### 1.2 Open SQL Editor

1. Look at the **left sidebar** (dark panel on the left)
2. Find and click **"SQL Editor"** (icon looks like `</>`)
3. Click the green **"New Query"** button (top right corner)

You should now see a blank text area where you can write SQL.

---

## 🗄️ Step 2: Create Database Tables

### 2.1 Copy This Complete Script

**Select and copy ALL of this SQL code:**

```sql
-- ============================================
-- ATTENDANCE MANAGEMENT SYSTEM - DATABASE SETUP
-- ============================================
-- This script creates all necessary tables and indexes
-- Run this FIRST before adding any users

-- Clean up existing tables (if any)
DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- CREATE USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CREATE ATTENDANCE RECORDS TABLE
-- ============================================
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

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_attendance_user_id ON attendance_records(user_id);
CREATE INDEX idx_attendance_date ON attendance_records(date);
CREATE INDEX idx_attendance_status ON attendance_records(status);
CREATE INDEX idx_attendance_created_by ON attendance_records(created_by);

-- ============================================
-- CREATE TRIGGER FOR AUTO-UPDATE TIMESTAMP
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_attendance_records_updated_at
  BEFORE UPDATE ON attendance_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DISABLE ROW LEVEL SECURITY (for development)
-- ============================================
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records DISABLE ROW LEVEL SECURITY;

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 'Tables created successfully!' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'attendance_records');
```

### 2.2 Paste and Run

1. **Paste** the copied SQL into the SQL Editor
2. Click the green **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`)
3. Wait for it to complete (should take 1-2 seconds)

### 2.3 Verify Success

You should see at the bottom:
- ✅ "Tables created successfully!"
- ✅ Two rows showing: `users` and `attendance_records`

**If you see errors:** The tables might already exist. That's OK - the script will recreate them.

---

## 👤 Step 3: Add Your First Admin User

### 3.1 Create Admin Account

Now we'll add your admin account so you can login.

**In the same SQL Editor, clear it and paste this:**

```sql
-- ============================================
-- ADD ADMIN USER
-- ============================================
-- IMPORTANT: Change the email, password, and name below!

INSERT INTO users (email, password, name, role)
VALUES (
  'admin@example.com',     -- ⚠️ CHANGE THIS to your email
  'admin123',              -- ⚠️ CHANGE THIS to your password
  'Admin User',            -- ⚠️ CHANGE THIS to your name
  'admin'                  -- ✅ Keep this as 'admin' (lowercase!)
)
RETURNING id, email, name, role;
```

### 3.2 Customize Your Credentials

**BEFORE running, edit these values:**

1. **Line 6:** Change `'admin@example.com'` to your actual email
2. **Line 7:** Change `'admin123'` to your desired password
3. **Line 8:** Change `'Admin User'` to your actual name
4. **Line 9:** Keep as `'admin'` (must be lowercase!)

**Example:**
```sql
INSERT INTO users (email, password, name, role)
VALUES (
  'john@mycompany.com',    -- Your email
  'MySecurePass123',       -- Your password
  'John Smith',            -- Your name
  'admin'                  -- Keep as 'admin'
)
RETURNING id, email, name, role;
```

### 3.3 Run the Query

1. Click **"Run"** (or press `Ctrl+Enter`)
2. You should see your user details returned

**✅ Success!** You now have an admin account.

**⚠️ IMPORTANT:** Remember the email and password you just used - you'll need them to login!

---

## 👥 Step 4: Add Team Members (Regular Users)

### 4.1 Add Your Team Members

Now let's add regular users (team members) who can view their own attendance.

**Clear the SQL Editor and paste this:**

```sql
-- ============================================
-- ADD TEAM MEMBERS (REGULAR USERS)
-- ============================================
-- Add as many users as you need
-- Copy the INSERT line for each team member

INSERT INTO users (email, password, name, role)
VALUES 
  ('user1@example.com', 'password1', 'Team Member 1', 'user'),
  ('user2@example.com', 'password2', 'Team Member 2', 'user'),
  ('user3@example.com', 'password3', 'Team Member 3', 'user')
RETURNING id, email, name, role;
```

### 4.2 Customize Team Members

**Edit the values for each team member:**

**Example:**
```sql
INSERT INTO users (email, password, name, role)
VALUES 
  ('alice@company.com', 'alice123', 'Alice Johnson', 'user'),
  ('bob@company.com', 'bob123', 'Bob Williams', 'user'),
  ('carol@company.com', 'carol123', 'Carol Davis', 'user')
RETURNING id, email, name, role;
```

**Notes:**
- Add or remove lines as needed
- Each line must end with a comma (except the last one)
- Role must be `'user'` (lowercase)
- Each email must be unique

### 4.3 Run the Query

1. Click **"Run"**
2. You should see all your team members returned

**✅ Success!** Your team members are now in the database.

---

## ✅ Step 5: Verify Everything

### 5.1 Check All Users

**Run this query to see all users:**

```sql
SELECT id, email, name, role, created_at
FROM users
ORDER BY role DESC, name;
```

You should see:
- ✅ Your admin user (role = 'admin')
- ✅ All team members (role = 'user')

### 5.2 Verify Table Structure

**Run this to confirm tables are set up correctly:**

```sql
-- Check users table
SELECT 'Users Table' as table_name, COUNT(*) as total_users FROM users;

-- Check attendance table
SELECT 'Attendance Table' as table_name, COUNT(*) as total_records FROM attendance_records;

-- Check columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
```

Expected output:
- Users table with your user count
- Attendance table with 0 records (empty for now)
- Columns: id, email, password, name, role, created_at

---

## 🧪 Step 6: Test Login

### 6.1 Open Your Application

1. Make sure your dev server is running
2. Open: **http://localhost:8081/login**

### 6.2 Test Admin Login

1. Enter your **admin email** (from Step 3)
2. Enter your **admin password** (from Step 3)
3. Click **"Sign In"**

**Expected Result:**
- ✅ Redirected to `/admin/dashboard`
- ✅ See "Admin Dashboard" header
- ✅ See "Welcome back, [Your Name]"
- ✅ See statistics cards (Total Records, Present, Absent, Late)
- ✅ See "Add Attendance" button
- ✅ Navigation shows "Dashboard" and "Logout"

### 6.3 Test User Login

1. Click **"Logout"** in the navigation
2. Enter a **team member email** (from Step 4)
3. Enter that **team member's password**
4. Click **"Sign In"**

**Expected Result:**
- ✅ Redirected to `/user/dashboard`
- ✅ See "My Attendance" header
- ✅ See personal statistics
- ✅ No "Add Attendance" button (read-only)

---

## 🎉 Success Checklist

If you can do all of these, setup is complete:

- [ ] Admin can login
- [ ] Admin sees admin dashboard
- [ ] Admin can click "Add Attendance" button
- [ ] User can login
- [ ] User sees user dashboard (read-only)
- [ ] User cannot add/edit records
- [ ] Logout works for both roles

---

## 🐛 Troubleshooting

### Problem: "Can't login with admin credentials"

**Solution 1: Check role is lowercase**
```sql
-- Fix role if it's capitalized
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

**Solution 2: Verify user exists**
```sql
SELECT email, password, role FROM users WHERE email = 'your@email.com';
```

**Solution 3: Check for spaces**
```sql
-- Check for extra spaces
SELECT email, LENGTH(email), password, LENGTH(password) 
FROM users WHERE email LIKE '%your@email%';
```

### Problem: "Tables don't exist"

**Solution: Re-run Step 2**
- Go back to Step 2
- Copy and run the table creation script again

### Problem: "Can't see attendance records"

**Solution: Add sample data**
```sql
-- Get your admin user ID first
SELECT id FROM users WHERE role = 'admin' LIMIT 1;

-- Then add a sample record (replace USER_ID and ADMIN_ID)
INSERT INTO attendance_records (user_id, user_name, date, status, created_by)
VALUES (
  'USER_ID_HERE',
  'User Name',
  CURRENT_DATE,
  'present',
  'ADMIN_ID_HERE'
);
```

---

## 📚 What's Next?

Now that setup is complete:

1. **Add Attendance Records** - Login as admin and click "Add Attendance"
2. **View Records** - Login as user to see personal attendance
3. **Add More Users** - Run Step 4 again to add more team members

---

## 🔐 Security Notes

**⚠️ IMPORTANT FOR PRODUCTION:**

This setup uses **plain text passwords** for simplicity. Before deploying to production:

1. **Implement password hashing** (bcrypt, argon2)
2. **Enable Row Level Security (RLS)** in Supabase
3. **Use environment variables** for Supabase credentials
4. **Or use Supabase Auth** (recommended - handles all security)

For development/testing, the current setup is fine.

---

## 📞 Need Help?

If you're stuck:

1. Check browser console (F12) for errors
2. Run verification queries from Step 5
3. See `TROUBLESHOOTING_LOGIN.md` for detailed debugging
4. See `TEST_SUPABASE_CONNECTION.sql` for test queries

---

## ✅ Quick Reference

**Your Supabase Project:** https://sawvlnfvcnotntgwieiz.supabase.co  
**Your App:** http://localhost:8081/login  
**Admin Dashboard:** http://localhost:8081/admin/dashboard  
**User Dashboard:** http://localhost:8081/user/dashboard

**Remember:** 
- Admin role = `'admin'` (lowercase)
- User role = `'user'` (lowercase)
- Passwords are case-sensitive
- Emails must be unique

---

**🎉 Congratulations! Your Attendance Management System is now fully set up and ready to use!**

