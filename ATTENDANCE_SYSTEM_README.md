# Attendance Management System

## Overview

A comprehensive attendance management system for the AutoArchitects ATV Club with role-based access control, featuring separate dashboards for administrators and team members.

## Features

### 🔐 Authentication & Authorization
- **Secure Login System**: Email and password-based authentication
- **Role-Based Access Control (RBAC)**: Two distinct user roles
  - **Admin**: Full access to manage attendance records
  - **User**: Read-only access to personal attendance records
- **Protected Routes**: Automatic redirection based on authentication status and user role
- **Session Persistence**: User sessions maintained using localStorage

### 👨‍💼 Admin Features
- **Dashboard Overview**: Real-time statistics showing:
  - Total attendance records
  - Present count
  - Absent count
  - Late arrivals
- **Add Attendance Records**: Create new attendance entries for any team member
- **Edit Attendance Records**: Modify existing attendance data
- **Advanced Filtering**: 
  - Search by team member name
  - Filter by attendance status (Present, Absent, Late, Leave)
- **Comprehensive Data Entry**:
  - Team member selection
  - Date selection
  - Status (Present/Absent/Late/Leave)
  - Check-in and check-out times
  - Notes field for additional information

### 👤 User Features
- **Personal Dashboard**: View-only access to individual attendance records
- **Statistics Overview**:
  - Total days tracked
  - Present days
  - Absent days
  - Late arrivals
  - Attendance percentage
- **Detailed Records Table**: Complete history with:
  - Date
  - Status
  - Check-in/Check-out times
  - Notes
  - Last updated timestamp
- **Summary Section**: Quick overview of attendance statistics

## System Architecture

### File Structure
```
src/
├── types/
│   └── auth.ts                 # TypeScript interfaces and types
├── contexts/
│   └── AuthContext.tsx         # Authentication context provider
├── components/
│   ├── ProtectedRoute.tsx      # Route protection component
│   ├── Navigation.tsx          # Updated navigation with auth
│   └── Layout.tsx              # Layout wrapper
├── pages/
│   ├── Login.tsx               # Enhanced login page
│   ├── AdminDashboard.tsx      # Admin attendance management
│   └── UserDashboard.tsx       # User attendance view
└── App.tsx                     # Main app with routing
```

### Key Components

#### 1. Authentication Context (`AuthContext.tsx`)
- Manages user authentication state
- Provides login/logout functionality
- Stores user session in localStorage
- Exports mock user database for demo purposes

#### 2. Protected Route (`ProtectedRoute.tsx`)
- Guards routes based on authentication status
- Enforces role-based access control
- Redirects unauthorized users appropriately

#### 3. Admin Dashboard (`AdminDashboard.tsx`)
- Full CRUD operations for attendance records
- Statistics dashboard
- Search and filter capabilities
- Modal dialogs for add/edit operations

#### 4. User Dashboard (`UserDashboard.tsx`)
- Read-only view of personal attendance
- Personal statistics
- Attendance history table
- Informational alerts

## User Credentials

**Note:** This system now uses Supabase for authentication. You need to add users directly in your Supabase database.

See `SUPABASE_QUICK_SETUP.md` for instructions on how to:
1. Set up the database tables
2. Add admin and user accounts
3. Configure credentials securely

## Routes

### Public Routes
- `/` - Home page
- `/about` - About page
- `/members` - Team members page
- `/login` - Login page

### Protected Routes
- `/admin/dashboard` - Admin dashboard (Admin only)
- `/user/dashboard` - User dashboard (User only)

## Data Storage

The system uses **localStorage** for data persistence:
- `currentUser`: Stores authenticated user information
- `attendanceRecords`: Stores all attendance records

### Attendance Record Structure
```typescript
{
  id: string;
  userId: string;
  userName: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
  createdBy: string;
  updatedAt: string;
}
```

## Security Features

1. **Role-Based Access Control**: Users can only access features appropriate to their role
2. **Protected Routes**: Unauthorized access attempts are redirected
3. **Session Management**: Automatic logout and session cleanup
4. **Data Isolation**: Users can only view their own attendance records
5. **Password Protection**: Login required for all dashboard access

## User Experience Features

### Visual Feedback
- **Toast Notifications**: Success/error messages for all actions
- **Loading States**: Visual feedback during authentication
- **Error Handling**: Clear error messages for failed operations
- **Status Badges**: Color-coded attendance status indicators
  - 🟢 Present - Green
  - 🔴 Absent - Red
  - 🟡 Late - Yellow
  - 🔵 Leave - Blue

### Responsive Design
- Mobile-friendly navigation
- Responsive tables and cards
- Touch-friendly buttons and controls
- Adaptive layouts for all screen sizes

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Clear visual hierarchy

## How to Use

### For Administrators

1. **Login**
   - Navigate to `/login`
   - Use admin credentials
   - Click "Sign In"

2. **Add Attendance**
   - Click "Add Attendance" button
   - Select team member
   - Choose date
   - Set status
   - Add check-in/check-out times (optional)
   - Add notes (optional)
   - Click "Add Record"

3. **Edit Attendance**
   - Click edit button on any record
   - Modify status, times, or notes
   - Click "Update Record"

4. **Filter Records**
   - Use search box to find by name
   - Use status dropdown to filter by attendance status

### For Team Members

1. **Login**
   - Navigate to `/login`
   - Use your credentials
   - Click "Sign In"

2. **View Attendance**
   - Automatically redirected to dashboard
   - View statistics at the top
   - Scroll to see detailed records
   - Check summary section for overview

3. **Logout**
   - Click "Logout" in navigation
   - Redirected to login page

## Technical Stack

- **Frontend Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **UI Components**: Shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Notifications**: Sonner (Toast)
- **Icons**: Lucide React
- **Build Tool**: Vite

## Future Enhancements

### Potential Features
1. **Backend Integration**: Connect to a real database and API
2. **Password Hashing**: Implement bcrypt or similar for password security
3. **JWT Authentication**: Token-based authentication
4. **Export Functionality**: Download attendance reports as CSV/PDF
5. **Date Range Filtering**: Filter records by date range
6. **Bulk Operations**: Add/edit multiple records at once
7. **Email Notifications**: Notify users of attendance updates
8. **Attendance Analytics**: Charts and graphs for attendance trends
9. **Leave Management**: Request and approve leave applications
10. **Biometric Integration**: Fingerprint or face recognition check-in

### Security Improvements
1. **Password Reset**: Forgot password functionality
2. **Two-Factor Authentication**: Additional security layer
3. **Session Timeout**: Automatic logout after inactivity
4. **Audit Logs**: Track all changes to attendance records
5. **Data Encryption**: Encrypt sensitive data at rest

## Development Notes

### Adding New Team Members
Add users directly to the Supabase database:

**Option 1: Using Supabase Table Editor**
1. Go to Supabase Table Editor
2. Select the `users` table
3. Click "Insert" → "Insert row"
4. Fill in: email, password, name, role ('user')
5. Click "Save"

**Option 2: Using SQL**
```sql
INSERT INTO users (email, password, name, role)
VALUES ('email@example.com', 'secure_password', 'Member Name', 'user');
```

The new user will automatically appear in the admin dashboard.

### Customizing Attendance Statuses
Modify the status type in `src/types/auth.ts` and update the UI components accordingly.

## Support

For issues or questions about the attendance system, contact:
- **Email**: support@autoarchitects.com
- **Admin**: admin@autoarchitects.com

## License

This attendance management system is developed for the AutoArchitects ATV Club.

---

**Built with ❤️ for AutoArchitects ATV Club**

