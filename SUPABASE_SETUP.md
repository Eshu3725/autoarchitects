# Supabase Database Setup Guide

## Database Schema

### 1. Users Table

This table stores user information and roles for authentication.

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  USING (auth.uid()::text = id::text);

-- Create policy: Admins can read all users
CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### 2. Attendance Records Table

This table stores all attendance records for team members.

```sql
-- Create attendance_records table
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

-- Enable Row Level Security
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can read their own attendance records
CREATE POLICY "Users can read own attendance"
  ON attendance_records
  FOR SELECT
  USING (user_id::text = auth.uid()::text);

-- Create policy: Admins can read all attendance records
CREATE POLICY "Admins can read all attendance"
  ON attendance_records
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'admin'
    )
  );

-- Create policy: Admins can insert attendance records
CREATE POLICY "Admins can insert attendance"
  ON attendance_records
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'admin'
    )
  );

-- Create policy: Admins can update attendance records
CREATE POLICY "Admins can update attendance"
  ON attendance_records
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'admin'
    )
  );

-- Create policy: Admins can delete attendance records
CREATE POLICY "Admins can delete attendance"
  ON attendance_records
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX idx_attendance_user_id ON attendance_records(user_id);
CREATE INDEX idx_attendance_date ON attendance_records(date);
CREATE INDEX idx_attendance_status ON attendance_records(status);
CREATE INDEX idx_attendance_created_by ON attendance_records(created_by);

-- Create trigger to update updated_at timestamp
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
```

## Initial Data Setup

### Insert Admin User

```sql
-- Insert admin user
INSERT INTO users (id, email, name, role)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@autoarchitects.com', 'Admin User', 'admin');
```

### Insert Team Members

```sql
-- Insert team members
INSERT INTO users (id, email, name, role)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 'kushal@autoarchitects.com', 'Kushal MV', 'user'),
  ('00000000-0000-0000-0000-000000000003', 'tejashree@autoarchitects.com', 'Tejashree P', 'user'),
  ('00000000-0000-0000-0000-000000000004', 'basavraj@autoarchitects.com', 'Basavraj L Arakeri', 'user'),
  ('00000000-0000-0000-0000-000000000005', 'kushalns@autoarchitects.com', 'Kushal NS', 'user'),
  ('00000000-0000-0000-0000-000000000006', 'karthik@autoarchitects.com', 'Karthik K', 'user');
```

### Insert Sample Attendance Records

```sql
-- Insert sample attendance records
INSERT INTO attendance_records (user_id, user_name, date, status, check_in_time, check_out_time, notes, created_by)
VALUES 
  (
    '00000000-0000-0000-0000-000000000002',
    'Kushal MV',
    '2025-11-07',
    'present',
    '09:00:00',
    '17:00:00',
    'On time',
    '00000000-0000-0000-0000-000000000001'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'Tejashree P',
    '2025-11-07',
    'present',
    '09:15:00',
    '17:00:00',
    'Slightly late',
    '00000000-0000-0000-0000-000000000001'
  );
```

## Setup Instructions

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase project: https://sawvlnfvcnotntgwieiz.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Create Tables

1. Copy the **Users Table** SQL from above
2. Paste into the SQL Editor
3. Click **Run** or press `Ctrl+Enter`
4. Repeat for **Attendance Records Table**

### Step 3: Insert Initial Data

1. Copy the **Insert Admin User** SQL
2. Run in SQL Editor
3. Copy the **Insert Team Members** SQL
4. Run in SQL Editor
5. Copy the **Insert Sample Attendance Records** SQL
6. Run in SQL Editor

### Step 4: Set Up Authentication

Since we're using custom user management (not Supabase Auth), we need to handle authentication in the application layer.

**Note**: The current implementation uses a custom authentication system with password verification in the application. For production, you should:

1. Use Supabase Auth for user management
2. Store password hashes (not plain text)
3. Use JWT tokens for session management

## Verification

After running all SQL commands, verify the setup:

```sql
-- Check users table
SELECT * FROM users;

-- Check attendance_records table
SELECT * FROM attendance_records;

-- Verify RLS policies
SELECT * FROM pg_policies WHERE tablename IN ('users', 'attendance_records');
```

## Row Level Security (RLS) Explained

### Users Table Policies
- **Users can read own data**: Users can only see their own user record
- **Admins can read all users**: Admin users can see all user records

### Attendance Records Table Policies
- **Users can read own attendance**: Users can only see their own attendance records
- **Admins can read all attendance**: Admins can see all attendance records
- **Admins can insert/update/delete**: Only admins can modify attendance records

## Important Notes

1. **Authentication**: The current setup uses custom authentication. The `auth.uid()` in RLS policies will need to be updated when integrating with Supabase Auth.

2. **Password Storage**: Passwords are currently stored in the application code. For production:
   - Use Supabase Auth
   - Or implement proper password hashing (bcrypt, argon2)

3. **API Keys**: The anon key is safe to use in client-side code as RLS policies protect the data.

4. **Testing**: After setup, test with both admin and user accounts to ensure RLS policies work correctly.

## Next Steps

After creating the database schema:

1. Update `AuthContext.tsx` to use Supabase for authentication
2. Update `AdminDashboard.tsx` to use Supabase for CRUD operations
3. Update `UserDashboard.tsx` to fetch data from Supabase
4. Test all functionality with the new database backend

## Troubleshooting

### Issue: RLS policies blocking queries
**Solution**: Temporarily disable RLS for testing:
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records DISABLE ROW LEVEL SECURITY;
```

Remember to re-enable after testing!

### Issue: Foreign key constraint errors
**Solution**: Ensure users exist before creating attendance records that reference them.

### Issue: UUID format errors
**Solution**: Use the exact UUIDs provided in the initial data setup, or generate new ones using `gen_random_uuid()`.

