# User Authentication Setup Guide

## Overview
Your website tracking tool now includes complete user authentication! Each user can register, login, and manage their own websites with unique URLs for analytics.

## 🚀 Quick Setup

### 1. Database Migration
Run the authentication migration in your Supabase SQL editor:

```bash
# Navigate to backend folder
cd backend

# Copy the SQL from auth_migration.sql and run it in Supabase SQL Editor
```

Or run this command if you're using a local PostgreSQL:
```bash
psql -U your_username -d your_database -f auth_migration.sql
```

### 2. Environment Variables
Add the JWT secret to your `.env` file in the `backend` folder:

```env
# Add this to your existing .env file
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Important**: Generate a strong random string for `JWT_SECRET` in production!

### 3. Install Dependencies (Already Done)
The required packages have been installed:
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation
- `cookie-parser` - Cookie handling

### 4. Start the Servers

#### Backend
```bash
cd backend
npm start
# Or for development with auto-reload:
npm run dev
```

#### Frontend
```bash
cd frontend
npm run dev
```

## 📋 What's New

### Backend Changes
1. **New Tables**:
   - `users` - Store user accounts
   - `user_sessions` - Track refresh tokens (optional)
   - `websites` now has `user_id` column

2. **New Endpoints**:
   - `POST /api/auth/register` - Register new user
   - `POST /api/auth/login` - Login user
   - `GET /api/auth/me` - Get current user
   - `GET /api/auth/verify` - Verify token
   - `POST /api/auth/logout` - Logout user

3. **Protected Endpoints**:
   - All `/api/websites/*` endpoints now require authentication
   - Users can only see and manage their own websites

### Frontend Changes
1. **New Pages**:
   - `/login` - Login page
   - `/register` - Registration page

2. **New Components**:
   - `Login.jsx` - Login form
   - `Register.jsx` - Registration form
   - `ProtectedRoute.jsx` - Route protection
   - `AuthContext.jsx` - Authentication state management

3. **Updated Components**:
   - `Navbar` - Now shows user info and logout button
   - `App.jsx` - Now has routing with auth protection
   - `api.js` - Now sends JWT tokens with requests

## 🔐 Features

### User Registration
- Email and password authentication
- Optional name field
- Password must be at least 6 characters
- Automatic login after registration

### User Login
- Secure JWT token-based authentication
- 7-day token expiration
- Remember user session
- Automatic redirect if token expires

### Website Isolation
- Each user can only see their own websites
- Unique URLs for each website's analytics: `/?resource_id=yourdomain.com`
- Share analytics with encoded domain in URL

### Security Features
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens for stateless authentication
- Protected API routes
- Automatic token validation
- Secure password requirements

## 📱 Usage

### First Time Setup
1. Visit `http://localhost:5173`
2. You'll be redirected to `/login`
3. Click "Create one now" to register
4. Fill in email, password (optional name)
5. You'll be automatically logged in

### Adding Websites
1. After login, click "Add Website"
2. Enter website name and domain
3. Website is automatically linked to your account

### Viewing Analytics
1. Click on any website card
2. URL updates to: `?resource_id=yourdomain.com`
3. Share this URL - it links directly to that website's analytics
4. Requires login to view

### Logging Out
- Click "Logout" button in navbar (desktop or mobile)
- All tokens are cleared
- Redirected to login page

## 🔧 Customization

### Token Expiration
Edit `backend/authController.js`:
```javascript
expiresIn: '7d' // Change to '1d', '12h', etc.
```

### Password Requirements
Edit `backend/authController.js` in the register function:
```javascript
if (password.length < 6) {  // Change minimum length
```

### JWT Secret
For production, use a strong random string:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🐛 Troubleshooting

### "Token expired" errors
- Tokens expire after 7 days by default
- User needs to login again
- Tokens are stored in localStorage

### "User not found" errors
- Run the database migration
- Check if backend is running
- Verify Supabase connection

### CORS errors
- Backend already configured for localhost:5173
- Add your production domain to CORS whitelist in `backend/index.js`

## 🚀 Next Steps

### Recommended Enhancements
1. **Email Verification**: Add email verification for new users
2. **Password Reset**: Implement forgot password functionality
3. **OAuth**: Add Google/GitHub login
4. **2FA**: Add two-factor authentication
5. **User Profile**: Allow users to update name, email, password
6. **API Keys**: Generate API keys for programmatic access
7. **Team Access**: Allow multiple users to access same websites

### Security Best Practices
- Use HTTPS in production
- Rotate JWT secrets periodically  
- Implement rate limiting on auth endpoints
- Add CAPTCHA for registration
- Log failed login attempts
- Implement account lockout after failed attempts

## 📚 File Structure

```
backend/
  ├── authMiddleware.js       # JWT verification middleware
  ├── authController.js       # Auth logic (login/register)
  ├── auth_migration.sql      # Database migration
  ├── index.js                # Main server (updated with auth)
  └── .env                    # Add JWT_SECRET here

frontend/
  ├── src/
  │   ├── components/
  │   │   ├── Login.jsx            # Login form
  │   │   ├── Register.jsx         # Registration form
  │   │   ├── ProtectedRoute.jsx   # Route protection
  │   │   └── Navbar.jsx           # Updated with user info
  │   ├── contexts/
  │   │   └── AuthContext.jsx      # Auth state management
  │   ├── services/
  │   │   ├── auth.js              # Auth API calls
  │   │   └── api.js               # Updated with JWT headers
  │   └── App.jsx                  # Updated routing
```

## 💡 Tips

- Test with multiple user accounts
- Clear localStorage if experiencing issues
- Check browser console for error messages
- Monitor backend logs for authentication issues
- Use Postman to test API endpoints directly

## 🎉 You're All Set!

Your website tracking tool now has complete user authentication. Users can:
- ✅ Register and login securely
- ✅ Add and manage their own websites
- ✅ View analytics with unique URLs
- ✅ Share analytics links with encoded domains
- ✅ Logout safely

Enjoy your secure multi-user analytics platform!
