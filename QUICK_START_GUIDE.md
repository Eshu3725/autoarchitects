# Quick Start Guide - Attendance Management System

## 🚀 Getting Started

### Step 1: Start the Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:8080`

### Step 2: Access the Login Page
Navigate to `http://localhost:8080/login`

## 🔑 User Credentials

**Note:** This system now uses Supabase for authentication. You need to add users in your Supabase database first.

See `SUPABASE_QUICK_SETUP.md` for instructions on:
1. Setting up the database
2. Adding admin and user accounts
3. Creating your own secure credentials

### Admin Role (Full Access)
**What admins can do:**
- ✅ View all attendance records
- ✅ Add new attendance records for any team member
- ✅ Edit existing attendance records
- ✅ Search and filter records
- ✅ View statistics dashboard

### User Role (View Only)
**What users can do:**
- ✅ View their own attendance records
- ✅ See their attendance statistics
- ✅ Check attendance percentage
- ❌ Cannot edit or add records

## 📋 Quick Testing Workflow

### Test Admin Features

1. **Login as Admin**
   - Go to `/login`
   - Click on the demo credentials box to auto-fill admin credentials
   - Click "Sign In"

2. **Add Attendance Record**
   - Click "Add Attendance" button
   - Select a team member (e.g., "Kushal MV")
   - Choose today's date
   - Select status: "Present"
   - Add check-in time: "09:00"
   - Add check-out time: "17:00"
   - Add notes: "On time, productive day"
   - Click "Add Record"

3. **Edit Attendance Record**
   - Find the record you just created
   - Click the edit button (pencil icon)
   - Change status to "Late"
   - Update check-in time to "09:30"
   - Update notes: "Arrived 30 minutes late"
   - Click "Update Record"

4. **Filter Records**
   - Use the search box to search for "Kushal"
   - Use the status dropdown to filter by "Present"
   - Clear filters to see all records

5. **Logout**
   - Click "Logout" in the navigation bar

### Test User Features

1. **Login as User**
   - Go to `/login`
   - Click on the user demo credentials to auto-fill
   - Click "Sign In"

2. **View Your Attendance**
   - You'll see your personal dashboard
   - Check the statistics cards at the top
   - Scroll down to see your attendance history
   - Notice you cannot edit any records

3. **Try to Access Admin Dashboard**
   - Manually navigate to `/admin/dashboard`
   - You'll be redirected back to `/user/dashboard`
   - This demonstrates role-based access control

4. **Logout**
   - Click "Logout" in the navigation bar

## 🎯 Key Features to Test

### Authentication & Authorization
- ✅ Login with valid credentials
- ✅ Login with invalid credentials (should show error)
- ✅ Automatic redirect based on role
- ✅ Protected routes (try accessing dashboards without login)
- ✅ Session persistence (refresh page while logged in)

### Admin Dashboard
- ✅ View statistics (Total, Present, Absent, Late)
- ✅ Add new attendance records
- ✅ Edit existing records
- ✅ Search by team member name
- ✅ Filter by status
- ✅ View all team members' records

### User Dashboard
- ✅ View personal statistics
- ✅ See attendance percentage
- ✅ View attendance history
- ✅ Read-only access (no edit buttons)
- ✅ Only see own records

### Navigation
- ✅ Public pages accessible without login
- ✅ Dashboard link appears when logged in
- ✅ Logout button appears when logged in
- ✅ Login link appears when logged out
- ✅ Mobile responsive menu

## 📱 Testing on Different Devices

### Desktop
- Full navigation bar visible
- All features accessible
- Optimal viewing experience

### Tablet
- Responsive layout
- Touch-friendly buttons
- Collapsible navigation

### Mobile
- Hamburger menu
- Stacked cards
- Scrollable tables
- Touch-optimized controls

## 🐛 Common Issues & Solutions

### Issue: Can't login
**Solution**: Make sure you've added users to the Supabase database. Check that email and password match exactly (case-sensitive).

### Issue: Redirected to login after refresh
**Solution**: This is normal if localStorage was cleared. Login again to restore session.

### Issue: Don't see any attendance records
**Solution**: 
- As Admin: Add some records using the "Add Attendance" button
- As User: Ask admin to add records for your account

### Issue: Can't access admin dashboard as user
**Solution**: This is by design. Users can only access `/user/dashboard`. Only admin accounts can access `/admin/dashboard`.

## 💡 Tips for Best Experience

1. **Use Chrome DevTools**: Open DevTools (F12) to see:
   - Console logs for debugging
   - Network requests
   - localStorage data

2. **Check localStorage**: 
   - Open DevTools → Application → Local Storage
   - See `currentUser` and `attendanceRecords`

3. **Test Different Scenarios**:
   - Add records for different dates
   - Try all status types (Present, Absent, Late, Leave)
   - Test with multiple users
   - Check statistics updates

4. **Mobile Testing**:
   - Use Chrome DevTools device emulation
   - Test on actual mobile devices
   - Check touch interactions

## 🔄 Reset Data

To reset all data and start fresh:

1. Open Browser DevTools (F12)
2. Go to Application → Local Storage
3. Delete `currentUser` and `attendanceRecords`
4. Refresh the page
5. Login again

## 📊 Sample Data

The system comes with 2 sample attendance records:
- Kushal MV - Present on 2025-11-07
- Tejashree P - Present on 2025-11-07

You can add more records as admin to test the system.

## 🎨 UI Components Used

- **Cards**: Statistics and content containers
- **Tables**: Attendance records display
- **Dialogs**: Add/Edit forms
- **Badges**: Status indicators
- **Buttons**: Actions and navigation
- **Inputs**: Form fields
- **Select**: Dropdowns
- **Toast**: Notifications

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Verify you're using the correct credentials
3. Clear localStorage and try again
4. Check the ATTENDANCE_SYSTEM_README.md for detailed documentation

## ✅ Testing Checklist

- [ ] Admin can login
- [ ] User can login
- [ ] Invalid credentials show error
- [ ] Admin can add attendance
- [ ] Admin can edit attendance
- [ ] Admin can search records
- [ ] Admin can filter by status
- [ ] User can view own records
- [ ] User cannot edit records
- [ ] User cannot access admin dashboard
- [ ] Admin cannot access user dashboard
- [ ] Logout works correctly
- [ ] Session persists on refresh
- [ ] Mobile menu works
- [ ] Toast notifications appear
- [ ] Statistics update correctly

---

**Happy Testing! 🎉**

