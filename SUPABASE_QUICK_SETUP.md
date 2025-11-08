# Supabase Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

Follow these steps to set up your Supabase database for the Attendance Management System.

### Step 1: Access Supabase SQL Editor

1. Open your Supabase project: https://sawvlnfvcnotntgwieiz.supabase.co
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run This Complete Setup Script

Copy and paste this entire script into the SQL Editor and click **Run** (or press Ctrl+Enter):

```sql
-- ============================================
-- ATTENDANCE MANAGEMENT SYSTEM - COMPLETE SETUP
-- ============================================

-- 1. CREATE USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CREATE ATTENDANCE RECORDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS attendance_records (
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

-- 3. CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance_records(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance_records(status);
CREATE INDEX IF NOT EXISTS idx_attendance_created_by ON attendance_records(created_by);

-- 4. CREATE TRIGGER FOR AUTO-UPDATE TIMESTAMP
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_attendance_records_updated_at ON attendance_records;
CREATE TRIGGER update_attendance_records_updated_at
  BEFORE UPDATE ON attendance_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. INSERT USERS (Add your own credentials here)
-- ============================================
-- Example: Uncomment and modify the lines below to add users
-- Replace 'your_password_here' with actual passwords
--
-- INSERT INTO users (id, email, password, name, role)
-- VALUES
--   ('00000000-0000-0000-0000-000000000001', 'admin@example.com', 'your_admin_password', 'Admin User', 'admin'),
--   ('00000000-0000-0000-0000-000000000002', 'user1@example.com', 'user1_password', 'User One', 'user'),
--   ('00000000-0000-0000-0000-000000000003', 'user2@example.com', 'user2_password', 'User Two', 'user')
-- ON CONFLICT (email) DO NOTHING;
--
-- NOTE: For production, use password hashing (bcrypt, argon2, etc.)
-- This is a simplified setup for demonstration purposes.

-- 6. INSERT SAMPLE ATTENDANCE RECORDS (Optional)
-- ============================================
-- You can add sample attendance records after creating users
-- Example:
--
-- INSERT INTO attendance_records (user_id, user_name, date, status, check_in_time, check_out_time, notes, created_by)
-- VALUES
--   (
--     'user_id_here',
--     'User Name',
--     '2025-11-08',
--     'present',
--     '09:00:00',
--     '17:00:00',
--     'Sample record',
--     'admin_user_id_here'
--   )
-- ON CONFLICT DO NOTHING;

-- 7. VERIFY SETUP
-- ============================================
SELECT 'Setup Complete!' as status;
SELECT 'Tables Created Successfully!' as message;
```

### Step 3: Add Your Users

After running the setup script, you need to add users to the database. You can do this in two ways:

**Option 1: Using SQL Editor**
```sql
-- Add an admin user
INSERT INTO users (email, password, name, role)
VALUES ('your_admin_email@example.com', 'your_secure_password', 'Admin Name', 'admin');

-- Add team members
INSERT INTO users (email, password, name, role)
VALUES
  ('user1@example.com', 'password1', 'User One', 'user'),
  ('user2@example.com', 'password2', 'User Two', 'user');
```

**Option 2: Using Supabase Dashboard**
1. Go to "Table Editor" in Supabase
2. Select the "users" table
3. Click "Insert" → "Insert row"
4. Fill in: email, password, name, role
5. Click "Save"

**⚠️ IMPORTANT**: For production, use password hashing (bcrypt, argon2, etc.). This plain text password storage is for demonstration only.

### Step 4: Test the Application

1. Make sure your dev server is running: `npm run dev`
2. Navigate to `http://localhost:8081/login`
3. Login with the credentials you created in Step 3
4. Start managing attendance records!

## 🔐 Important Notes

### Authentication
- The system uses **custom authentication** (not Supabase Auth)
- Passwords are verified in the application code
- User data is stored in the `users` table
- For production, implement proper password hashing

### Row Level Security (RLS)
The current setup **does NOT use RLS** for simplicity. This means:
- ✅ Easier to set up and test
- ✅ Works immediately without complex policies
- ⚠️ Less secure for production use

**For production**, you should enable RLS. See `SUPABASE_SETUP.md` for detailed RLS policies.

### API Keys
- The **anon key** is safe to use in client-side code
- It's already configured in `src/lib/supabase.ts`
- No additional configuration needed

## 📊 Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | TEXT | Unique email address |
| password | TEXT | User password (use hashing in production!) |
| name | TEXT | User's full name |
| role | TEXT | 'admin' or 'user' |
| created_at | TIMESTAMPTZ | Account creation time |

### Attendance Records Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Reference to users table |
| user_name | TEXT | User's name (denormalized) |
| date | DATE | Attendance date |
| status | TEXT | 'present', 'absent', 'late', or 'leave' |
| check_in_time | TIME | Check-in time (optional) |
| check_out_time | TIME | Check-out time (optional) |
| notes | TEXT | Additional notes (optional) |
| created_by | UUID | Admin who created the record |
| created_at | TIMESTAMPTZ | Record creation time |
| updated_at | TIMESTAMPTZ | Last update time |

## 🧪 Testing Queries

### View All Users
```sql
SELECT * FROM users ORDER BY role, name;
```

### View All Attendance Records
```sql
SELECT * FROM attendance_records ORDER BY date DESC;
```

### View Attendance for Specific User
```sql
SELECT * FROM attendance_records 
WHERE user_id = '00000000-0000-0000-0000-000000000002'
ORDER BY date DESC;
```

### Get Attendance Statistics
```sql
SELECT 
  status,
  COUNT(*) as count
FROM attendance_records
GROUP BY status;
```

## 🔧 Troubleshooting

### Issue: "relation already exists"
**Solution**: The tables already exist. You can either:
1. Drop and recreate: Run `DROP TABLE attendance_records, users CASCADE;` first
2. Or just skip the error - the data will still be inserted

### Issue: "duplicate key value violates unique constraint"
**Solution**: The data already exists. This is fine - the script uses `ON CONFLICT DO NOTHING` to handle this.

### Issue: Can't see data in the app
**Solution**: 
1. Check browser console for errors
2. Verify Supabase URL and anon key in `src/lib/supabase.ts`
3. Make sure the dev server is running
4. Try logging out and logging in again

### Issue: "permission denied"
**Solution**: Make sure you're logged into Supabase and have access to the project.

## 🎯 Next Steps

1. ✅ Run the setup script above
2. ✅ Test login with admin account
3. ✅ Add some attendance records
4. ✅ Test login with user account
5. ✅ Verify users can only see their own records

## 📚 Additional Resources

- **Full Setup Guide**: See `SUPABASE_SETUP.md` for detailed information
- **Application Guide**: See `ATTENDANCE_SYSTEM_README.md` for app features
- **Quick Start**: See `QUICK_START_GUIDE.md` for testing workflows

## 🆘 Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Check the Supabase logs in the dashboard
3. Verify the SQL script ran successfully
4. Make sure all tables were created

---

**You're all set! 🎉**

The attendance management system is now connected to Supabase and ready to use!

