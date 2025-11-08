# ⚡ Supabase Setup - Quick Cheatsheet

**Copy and paste these SQL queries in order. That's it!**

---

## 🔗 Open This First

**Supabase SQL Editor:** https://sawvlnfvcnotntgwieiz.supabase.co  
→ Click "SQL Editor" (left sidebar) → Click "New Query"

---

## 📝 Step 1: Create Tables (Copy & Run)

```sql
-- Create tables
DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_attendance_user_id ON attendance_records(user_id);
CREATE INDEX idx_attendance_date ON attendance_records(date);

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records DISABLE ROW LEVEL SECURITY;

SELECT 'Setup Complete!' as status;
```

---

## 👤 Step 2: Add Admin User (Edit & Run)

**⚠️ CHANGE the email, password, and name before running!**

```sql
INSERT INTO users (email, password, name, role)
VALUES (
  'admin@example.com',    -- ⚠️ CHANGE THIS
  'admin123',             -- ⚠️ CHANGE THIS
  'Admin Name',           -- ⚠️ CHANGE THIS
  'admin'                 -- ✅ Keep lowercase
)
RETURNING *;
```

---

## 👥 Step 3: Add Team Members (Edit & Run)

**⚠️ CHANGE the emails, passwords, and names before running!**

```sql
INSERT INTO users (email, password, name, role)
VALUES 
  ('user1@example.com', 'pass1', 'User One', 'user'),
  ('user2@example.com', 'pass2', 'User Two', 'user'),
  ('user3@example.com', 'pass3', 'User Three', 'user')
RETURNING *;
```

---

## ✅ Step 4: Verify (Copy & Run)

```sql
  SELECT email, name, role FROM users ORDER BY role DESC;
```

You should see your admin and all users listed.

---

## 🧪 Step 5: Test Login

1. Go to: **http://localhost:8081/login**
2. Login with your admin email/password from Step 2
3. Should redirect to admin dashboard ✅

---

## 🔧 Quick Fixes

### Can't Login?

```sql
-- Check what's in the database
SELECT email, password, role FROM users;

-- Fix role if needed (change email)
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

### Start Over?

```sql
-- Delete all users
DELETE FROM users;

-- Then go back to Step 2
```

---

## 📋 Remember

- ✅ Role must be lowercase: `'admin'` or `'user'`
- ✅ Passwords are case-sensitive
- ✅ Each email must be unique
- ✅ Keep your credentials safe!

---

## 🎯 That's It!

**3 SQL queries = Complete setup**

For detailed help, see: `COMPLETE_SUPABASE_SETUP.md`

