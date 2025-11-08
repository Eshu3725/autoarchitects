# Troubleshooting Login Issues

## 🔍 Common Issues When Creating Users in Supabase

### Issue: "Can't login with credentials created in Supabase"

Here are the most common causes and solutions:

---

## ✅ **Step-by-Step Verification**

### **1. Verify User Was Created in Supabase**

Go to Supabase Dashboard → Table Editor → `users` table

**Check that:**
- ✅ User exists in the table
- ✅ Email is correct (no extra spaces)
- ✅ Password is correct (no extra spaces)
- ✅ Role is set to `'admin'` (lowercase, in quotes)
- ✅ Name is filled in

**Common Mistakes:**
- ❌ Role set to `"Admin"` instead of `"admin"` (case-sensitive!)
- ❌ Extra spaces in email or password
- ❌ Missing required fields (name, role)

---

### **2. Check the Exact SQL You Used**

**✅ CORRECT Format:**
```sql
INSERT INTO users (email, password, name, role)
VALUES ('admin@example.com', 'yourpassword', 'Admin Name', 'admin');
```

**❌ WRONG Formats:**
```sql
-- Wrong: Role capitalized
VALUES ('admin@example.com', 'yourpassword', 'Admin Name', 'Admin');

-- Wrong: Missing quotes around role
VALUES ('admin@example.com', 'yourpassword', 'Admin Name', admin);

-- Wrong: Extra spaces
VALUES (' admin@example.com ', ' yourpassword ', 'Admin Name', 'admin');
```

---

### **3. Verify Table Structure**

Run this query in Supabase SQL Editor:

```sql
-- Check if users table exists and has correct columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
```

**Expected Output:**
```
column_name  | data_type | is_nullable
-------------|-----------|------------
id           | uuid      | NO
email        | text      | NO
password     | text      | NO
name         | text      | NO
role         | text      | NO
created_at   | timestamp | YES
```

If `password` column is missing, you need to add it:
```sql
ALTER TABLE users ADD COLUMN password TEXT NOT NULL DEFAULT '';
```

---

### **4. Test Your Credentials Directly in Supabase**

Run this query to verify your user exists:

```sql
-- Replace with YOUR email and password
SELECT id, email, name, role
FROM users
WHERE email = 'admin@example.com'
  AND password = 'yourpassword';
```

**Expected Result:**
- Should return 1 row with your user data
- If it returns 0 rows, the credentials don't match

**If no results:**
```sql
-- Check what's actually in the table
SELECT id, email, password, name, role
FROM users
WHERE email = 'admin@example.com';
```

This will show you what password is actually stored.

---

### **5. Check Browser Console for Errors**

1. Open your browser (Chrome/Edge/Firefox)
2. Press `F12` to open Developer Tools
3. Go to the **Console** tab
4. Try to login
5. Look for error messages

**Common Console Errors:**

**Error: "Supabase query error"**
- Problem: Database connection or query issue
- Solution: Check Supabase project URL and anon key in `src/lib/supabase.ts`

**Error: "Invalid email or password"**
- Problem: No matching user found
- Solution: Verify credentials in Supabase table

**Error: "relation 'users' does not exist"**
- Problem: Users table not created
- Solution: Run the setup SQL script from `SUPABASE_QUICK_SETUP.md`

---

### **6. Verify Supabase Connection**

Check `src/lib/supabase.ts`:

```typescript
const supabaseUrl = 'https://sawvlnfvcnotntgwieiz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

**Test connection in browser console:**
1. Open browser console (F12)
2. Go to your app at `http://localhost:8081`
3. Type in console:
```javascript
// This should log the Supabase client
console.log(window);
```

---

### **7. Check Row Level Security (RLS)**

If RLS is enabled, it might block queries.

**Check RLS status:**
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'attendance_records');
```

**If RLS is enabled (rowsecurity = true), disable it for testing:**
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records DISABLE ROW LEVEL SECURITY;
```

⚠️ **Note:** For production, you should enable RLS with proper policies. But for testing, disable it.

---

## 🔧 **Quick Fix: Complete Reset**

If nothing works, try this complete reset:

### **Step 1: Drop and Recreate Tables**
```sql
-- Drop existing tables
DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Recreate from scratch (copy from SUPABASE_QUICK_SETUP.md)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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
```

### **Step 2: Add Admin User**
```sql
INSERT INTO users (email, password, name, role)
VALUES ('admin@test.com', 'admin123', 'Test Admin', 'admin');
```

### **Step 3: Verify**
```sql
SELECT * FROM users;
```

### **Step 4: Test Login**
- Email: `admin@test.com`
- Password: `admin123`

---

## 📋 **Debugging Checklist**

Use this checklist to debug your issue:

- [ ] Tables created successfully (run setup SQL)
- [ ] `password` column exists in `users` table
- [ ] User inserted into Supabase (check Table Editor)
- [ ] Email matches exactly (no spaces)
- [ ] Password matches exactly (no spaces)
- [ ] Role is lowercase `'admin'` not `'Admin'`
- [ ] Supabase URL and key are correct in `src/lib/supabase.ts`
- [ ] RLS is disabled (for testing)
- [ ] Browser console shows no errors
- [ ] Dev server is running (`npm run dev`)
- [ ] Tried hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

---

## 🎯 **Most Common Solution**

**90% of login issues are caused by:**

1. **Role case mismatch**: Using `'Admin'` instead of `'admin'`
2. **Missing password column**: Table created before password column was added
3. **Extra spaces**: Copy-pasting credentials with spaces

**Quick Test:**
```sql
-- This should work if everything is set up correctly
INSERT INTO users (email, password, name, role)
VALUES ('test@test.com', 'test123', 'Test User', 'admin');

-- Then try logging in with:
-- Email: test@test.com
-- Password: test123
```

---

## 🆘 **Still Not Working?**

If you've tried everything above and still can't login:

1. **Share the exact SQL you used** to create the user
2. **Share the output** of this query:
   ```sql
   SELECT id, email, password, name, role FROM users;
   ```
3. **Share any errors** from the browser console (F12)
4. **Share a screenshot** of the Supabase Table Editor showing the users table

---

## ✅ **Expected Behavior**

When login works correctly:

1. Enter email and password
2. Click "Sign In"
3. If **admin**: Redirected to `/admin/dashboard`
4. If **user**: Redirected to `/user/dashboard`
5. Navigation shows "Dashboard" and "Logout" buttons
6. Can see attendance records

---

## 🔐 **Security Note**

Remember: This setup uses **plain text passwords** for demonstration only.

**For production:**
- Use Supabase Auth (recommended)
- Or implement bcrypt/argon2 password hashing
- Enable Row Level Security (RLS)
- Use environment variables for Supabase credentials

