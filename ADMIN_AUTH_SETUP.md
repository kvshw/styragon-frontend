# Admin Authentication Setup

This guide explains how to set up and use the admin authentication system for the Styragon admin dashboard.

## 🔐 Authentication Features

- **Secure Login**: Email/password authentication using Supabase Auth
- **Protected Routes**: Admin dashboard is only accessible to authenticated users
- **Session Management**: Automatic session handling and logout
- **Luxury UI**: Beautiful login page matching the brand aesthetic

## 🚀 Setup Instructions

### 1. Create Admin Users

You need to create admin users in Supabase. You can do this in two ways:

#### Option A: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Users**
3. Click **"Add user"**
4. Enter admin email and password
5. Set **Email Confirmed** to `true`
6. Add user metadata: `{"role": "admin"}`

#### Option B: Using the Script
1. Set your Supabase service role key as an environment variable:
   ```bash
   export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   ```
2. Run the admin user creation script:
   ```bash
   npx tsx scripts/create-admin-user.ts
   ```

### 2. Default Admin Credentials

The script creates a default admin user:
- **Email**: `admin@styragon.com`
- **Password**: `StyragonAdmin2024!`

⚠️ **Important**: Change the password after first login!

### 3. Environment Variables

Make sure these are set in your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 🎯 How to Use

### Accessing the Admin Dashboard

1. Navigate to `/admin` in your browser
2. You'll see the login page if not authenticated
3. Enter your admin credentials
4. Click "Sign In"
5. You'll be redirected to the admin dashboard

### Admin Dashboard Features

- **User Info**: See your email in the header
- **Sign Out**: Click the "Sign Out" button to logout
- **View Site**: Quick link back to the main website
- **Full CRUD**: Create, read, update, delete blog posts and projects

## 🔒 Security Features

### Authentication Guard
- All admin routes are protected
- Unauthenticated users see the login page
- Session is automatically managed

### Session Management
- Automatic session refresh
- Secure logout functionality
- Session persistence across browser refreshes

### User Management
- Only users with valid Supabase accounts can access admin
- Easy to add/remove admin users through Supabase dashboard
- No hardcoded credentials in the codebase

## 🛠️ Adding More Admin Users

### Through Supabase Dashboard:
1. Go to **Authentication** > **Users**
2. Click **"Add user"**
3. Enter email and password
4. Set **Email Confirmed** to `true`
5. Add metadata: `{"role": "admin"}`

### Through Code:
Modify `scripts/create-admin-user.ts` to add more users:

```typescript
const adminUsers = [
  { email: 'admin1@styragon.com', password: 'Password1!' },
  { email: 'admin2@styragon.com', password: 'Password2!' }
]

for (const user of adminUsers) {
  await createAdminUser(user.email, user.password)
}
```

## 🎨 UI Features

### Login Page
- **Luxury Design**: Matches the main site aesthetic
- **Responsive**: Works on all devices
- **Form Validation**: Real-time error handling
- **Password Toggle**: Show/hide password functionality
- **Loading States**: Smooth loading indicators

### Admin Header
- **User Info**: Shows logged-in user's email
- **Quick Actions**: Sign out and view site buttons
- **Consistent Styling**: Matches the luxury theme

## 🔧 Troubleshooting

### Common Issues

1. **"Invalid login credentials"**
   - Check email and password are correct
   - Ensure user exists in Supabase
   - Verify email is confirmed

2. **"User not found"**
   - User doesn't exist in Supabase
   - Create user through Supabase dashboard

3. **Session not persisting**
   - Check Supabase configuration
   - Verify environment variables

### Debug Steps

1. Check browser console for errors
2. Verify Supabase project settings
3. Check network tab for failed requests
4. Ensure environment variables are correct

## 📱 Mobile Support

The admin authentication system is fully responsive:
- Login form adapts to mobile screens
- Touch-friendly input fields
- Proper keyboard handling
- Mobile-optimized button sizes

## 🔄 Session Management

- **Auto-refresh**: Sessions automatically refresh
- **Logout**: Clean session termination
- **Persistence**: Sessions survive browser restarts
- **Security**: Secure token handling

Your admin dashboard is now fully secured with enterprise-level authentication! 🎉
