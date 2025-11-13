# EmailJS Setup Guide for Student Registration Form

This guide will help you configure EmailJS to receive student registration emails from the AutoArchitects ATV Club website.

## 📧 What is EmailJS?

EmailJS is a service that allows you to send emails directly from client-side JavaScript without needing a backend server. It's perfect for contact forms and registration forms.

## 🚀 Setup Instructions

### Step 1: Create an EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click **"Sign Up"** (it's free for up to 200 emails/month)
3. Create your account using email or Google sign-in

### Step 2: Add an Email Service

1. After logging in, go to **"Email Services"** in the dashboard
2. Click **"Add New Service"**
3. Choose your email provider (Gmail is recommended):
   - **Gmail**: Select "Gmail" and connect your Google account
   - **Outlook**: Select "Outlook" and connect your Microsoft account
   - **Other**: You can use any SMTP service
4. Click **"Create Service"**
5. **Copy the Service ID** (e.g., `service_jpb9y27`) - you already have this one!

### Step 3: Create an Email Template

1. Go to **"Email Templates"** in the dashboard
2. Click **"Create New Template"**
3. Use the following template configuration:

#### Template Name
```
Student Registration - AutoArchitects
```

#### Template Content (Subject)
```
New Student Registration - {{student_name}}
```

#### Template Content (Body)
```html
<h2>New Student Registration - AutoArchitects ATV Club</h2>

<p>A new student has registered to join the AutoArchitects ATV Club.</p>

<h3>Student Details:</h3>
<ul>
  <li><strong>Name:</strong> {{student_name}}</li>
  <li><strong>USN:</strong> {{student_usn}}</li>
  <li><strong>Email:</strong> {{student_email}}</li>
  <li><strong>Phone:</strong> {{student_phone}}</li>
  <li><strong>Role Interested In:</strong> {{role_interested}}</li>
  <li><strong>Part of Other Club:</strong> {{part_of_other_club}}</li>
  <li><strong>Other Club Name:</strong> {{other_club_name}}</li>
</ul>

<hr>

<p><strong>Full Message:</strong></p>
<pre>{{message}}</pre>

<hr>
<p><em>This email was sent from the AutoArchitects ATV Club registration form.</em></p>
```

#### Template Settings
- **To Email**: `kushalmvkushi2@gmail.com` (hardcoded - EmailJS does not support dynamic recipient emails for security)
- **From Name**: `AutoArchitects Registration`
- **Reply To**: `{{student_email}}` (so you can reply directly to the student)

4. Click **"Save"**
5. **Copy the Template ID** (e.g., `template_abc123xyz`)

### Step 4: Get Your Public Key

1. Go to **"Account"** → **"General"** in the EmailJS dashboard
2. Find the **"Public Key"** section
3. **Copy your Public Key** (e.g., `abcdefghijklmnop`)

### Step 5: Update the Code

Open the file `src/components/RegistrationModal.tsx` and update these lines (around line 77-79):

```typescript
// EmailJS Configuration - Replace these with your actual credentials
const EMAILJS_SERVICE_ID = 'service_jpb9y27';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // ← Replace with your Template ID
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';   // ← Replace with your Public Key
```

**Example after updating:**
```typescript
const EMAILJS_SERVICE_ID = 'service_jpb9y27';
const EMAILJS_TEMPLATE_ID = 'template_abc123xyz';
const EMAILJS_PUBLIC_KEY = 'abcdefghijklmnop';
```

### Step 6: Test the Form

1. Open your website at [http://localhost:8081/](http://localhost:8081/)
2. Click the **"Join Team"** button in the hero section
3. Fill out the registration form with test data
4. Click **"Submit Registration"**
5. Check the email inbox you configured in EmailJS (kushalmvkushi2@gmail.com)

## 🎨 Form Features

### ✅ Implemented Features

- **Modal Dialog**: Clean, modern popup with glassmorphism design
- **Form Fields**:
  - Name (required)
  - USN (required, auto-uppercase)
  - Email (required, with validation)
  - Phone Number (required, 10-digit validation, numeric only)
  - Role dropdown (required) - 8 roles available
  - Other club radio buttons (Yes/No)
  - Conditional club name field (appears only if "Yes" is selected)
- **Validation**:
  - All fields are validated before submission
  - Email format validation
  - Phone number validation (10 digits, starting with 6-9)
  - Error messages displayed for invalid fields
  - Real-time error clearing as user types
- **EmailJS Integration**:
  - Sends formatted email with all registration details
  - Loading state during submission
  - Success/error notifications
  - Auto-close modal after successful submission
- **UX Features**:
  - Smooth animations (fade in/out, scale)
  - Focus management
  - Escape key to close
  - Click backdrop to close
  - Responsive design (mobile, tablet, desktop)
  - AutoArchitects color scheme (Racing Red #E60012)

## 📝 Email Format

When a student submits the form, you'll receive an email like this:

```
Subject: New Student Registration - John Doe

New Student Registration - AutoArchitects ATV Club

Name: John Doe
USN: 1SI23ME426
Email: john.doe@example.com
Phone: 9876543210
Role Interested In: Steering
Part of Other Club: Yes
Other Club Name: Robotics Club
```

## 🔧 Troubleshooting

### Issue: "EmailJS is not configured yet" error
**Solution**: Make sure you've replaced `YOUR_TEMPLATE_ID` and `YOUR_PUBLIC_KEY` with your actual credentials.

### Issue: "Recipient address is empty" or "No recipient defined" error
**Solution**:
1. Go to your EmailJS dashboard → Email Templates → Select your template
2. In the **"To Email"** field under Template Settings, enter: `kushalmvkushi2@gmail.com`
3. **DO NOT** use `{{to_email}}` - EmailJS does not support dynamic recipient emails for security reasons
4. The recipient email must be hardcoded in the template settings
5. Click "Save" and test the form again

### Issue: Emails not being received
**Solutions**:
1. Check your spam/junk folder
2. Verify the "To Email" in your EmailJS template is set to `kushalmvkushi2@gmail.com` (hardcoded, not a variable)
3. Check EmailJS dashboard for delivery status
4. Ensure you haven't exceeded the free tier limit (200 emails/month)
5. Verify your email service is connected in EmailJS dashboard

### Issue: Form validation not working
**Solution**: This is a client-side issue. Check the browser console for errors.

## 📊 EmailJS Free Tier Limits

- **200 emails per month** (free)
- Upgrade to paid plans for more emails
- Monitor usage in EmailJS dashboard

## 🎯 Next Steps

1. Set up EmailJS account
2. Create email template
3. Update the credentials in `RegistrationModal.tsx`
4. Test the form
5. Monitor registrations in your email

## 📞 Support

If you need help:
- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Support: [https://www.emailjs.com/support/](https://www.emailjs.com/support/)

---

**Note**: The Service ID `service_jpb9y27` is already configured in the code. You only need to add the Template ID and Public Key.

