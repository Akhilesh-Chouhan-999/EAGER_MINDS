# 🔐 EagerMinds - Credentials & Setup Guide

## 📋 CURRENT STATUS

| Feature | Status | Issue | Fix Status |
|---------|--------|-------|------------|
| Email/Password Signup | ⚠️ Works* | Needs real Resend API | Step 1 |
| Email/Password Login | ✅ Works | None | Ready |
| Google OAuth | ⚠️ Works* | Redirect URI mismatch | Step 2 |
| Welcome Emails | ❌ Not Sent | Dummy API key | Step 1 |
| Production Deploy | ❌ Not Done | Needs hosting setup | Steps 3-4 |

*Works locally, will fail in production without proper credentials

---

## ✅ STEP 1: RESEND EMAIL SERVICE (Most Critical)

### What It Does
Sends welcome emails to new users when they sign up.

### Current Problem
```env
RESEND_API_KEY=re_dummy_key  ❌ This doesn't work
```

### How to Get Real Key (2 minutes)

#### Step 1a: Go to Resend Website
1. Open: https://resend.com
2. Click **"Sign Up"** (top right)
3. Enter email and create password
4. Click verification link in email

#### Step 1b: Get API Key
1. After login, go to: Dashboard → **API Keys** (left sidebar)
2. Click **"Create API Key"** button
3. Choose name: `EagerMinds Local` or `EagerMinds Prod`
4. Copy the key (starts with `re_`)
5. Keep it PRIVATE (never share!)

#### Step 1c: Add to Backend
1. Open `backend/.env`
2. Replace this:
   ```env
   RESEND_API_KEY=re_dummy_key
   ```
   With this (your actual key):
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
3. Save file
4. Restart backend: `npm run dev:backend`

#### Step 1d: Test It
1. Sign up at: http://localhost:5173/signup
2. Check console for: `✅ Email sent successfully` OR `Welcome email failed (non-fatal)`
3. Check your email inbox (might be in spam)

---

## ✅ STEP 2: GOOGLE OAUTH (Most Complex)

### What It Does
Allows users to sign up/login with Google account instead of email/password.

### Current Problem
```
Google OAuth returns: "Invalid redirect URL"
```
Because Supabase doesn't know where to redirect after Google login.

### How to Setup Google OAuth (10 minutes)

#### Step 2a: Get Google OAuth Credentials
1. Go to: https://console.cloud.google.com
2. Click **"Create Project"** at top
3. Project name: `EagerMinds Bookmarks`
4. Click **"Create"** (wait 30 seconds)
5. Go to: **APIs & Services** → **OAuth consent screen** (left menu)
6. Select: **External**
7. Click **"Create"**
8. Fill form:
   - **App name**: EagerMinds Bookmarks
   - **User support email**: your-email@gmail.com
   - **Developer contact**: your-email@gmail.com
9. Click **"Save and Continue"**
10. On "Scopes" page: Just click **"Save and Continue"**
11. On "Test users" page: Click **"Add Users"** and add your Google email
12. Click **"Save and Continue"**
13. Review and click **"Back to Dashboard"**

#### Step 2b: Create OAuth 2.0 Credentials
1. Go to: **APIs & Services** → **Credentials** (left menu)
2. Click **"Create Credentials"** at top
3. Choose: **OAuth 2.0 Client ID**
4. Choose type: **Web Application**
5. Click **"Create"**
6. Fill form:
   ```
   Name: EagerMinds Dev
   
   Authorized JavaScript origins:
   - http://localhost:5173
   - http://localhost:5000
   
   Authorized redirect URIs:
   - http://localhost:5000/api/auth/callback
   - http://localhost:5173/dashboard
   ```
7. Click **"Create"**
8. Copy and save:
   - **Client ID** (long string ending with .apps.googleusercontent.com)
   - **Client Secret** (also long string)

#### Step 2c: Add to Supabase
1. Open: https://supabase.com and login
2. Go to: **Project Settings** → **Authentication** → **Providers**
3. Find: **Google** in the list
4. Click **"Enable"**
5. Paste your credentials:
   - **Client ID**: From Step 2b
   - **Client Secret**: From Step 2b
6. Click **"Save"**

#### Step 2d: Configure Backend
1. Open `backend/.env`
2. Add these new lines:
   ```env
   FRONTEND_URL=http://localhost:5173
   GOOGLE_CLIENT_ID=your-client-id-here
   GOOGLE_CLIENT_SECRET=your-client-secret-here
   ```
3. Save and restart backend

#### Step 2e: Test It
1. Go to: http://localhost:5173/signup
2. Click **"Sign up with Google"** button
3. Select your Google account
4. Should redirect to dashboard
5. Check console for errors

---

## ✅ STEP 3: DATABASE SETUP (Already Done ✅)

### Supabase Credentials (You Already Have)
```env
SUPABASE_URL=https://ggcqzqnsqbjkzqdnqpaj.supabase.co
SUPABASE_ANON_KEY=sb_publishable_JbXEufx37AgNSELt1q1r_Q_7_rJ1QRt
```

### What to Check
1. Go to: https://supabase.com → Login
2. Select project: **EAGER_MINDS** (or your project name)
3. Go to: **SQL Editor**
4. Run this query to verify database:
   ```sql
   SELECT COUNT(*) as users FROM public.profiles;
   SELECT COUNT(*) as bookmarks FROM public.bookmarks;
   ```
5. Should show numbers ≥ 0

### If Database is Empty
1. Go to: **SQL Editor**
2. Copy-paste entire content from: `context/schema.sql`
3. Click **"RUN"**
4. Verify: See green checkmarks

---

## ✅ STEP 4: PRODUCTION DEPLOYMENT SETUP

### When Ready to Deploy (Do This Later)

#### 4a: Update Environment Variables
```env
# backend/.env (for production)
PORT=5000
SUPABASE_URL=https://ggcqzqnsqbjkzqdnqpaj.supabase.co
SUPABASE_ANON_KEY=sb_publishable_JbXEufx37AgNSELt1q1r_Q_7_rJ1QRt
RESEND_API_KEY=re_xxxxxxxxx  (from Step 1)
FRONTEND_URL=https://your-frontend-domain.com
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
```

```env
# frontend/.env.local (for production)
VITE_API_BASE_URL=https://your-backend-api.com
```

#### 4b: Update Google OAuth Redirect URLs
1. Go to: Google Console → **Credentials**
2. Click your OAuth app
3. Add these redirect URIs:
   ```
   https://your-frontend-domain.com/dashboard
   https://your-backend-api.com/api/auth/callback
   ```

#### 4c: Update Supabase Google Provider
1. Go to: Supabase → **Settings** → **Auth** → **Providers** → **Google**
2. Update redirect URL to:
   ```
   https://your-backend-api.com/api/auth/callback
   ```

---

## 🚀 QUICK START (Complete Checklist)

### ✅ For Local Development (Today)
- [ ] Step 1: Get Resend API Key and add to `.env`
- [ ] Step 2: Get Google OAuth credentials and setup
- [ ] Test signup/login at http://localhost:5173
- [ ] Check emails arrived (might be in spam)
- [ ] Check Google OAuth works

### ✅ Before Production Deploy (Later)
- [ ] Get hosting (Vercel for frontend, Render/Railway for backend)
- [ ] Create accounts on those services
- [ ] Deploy frontend
- [ ] Deploy backend
- [ ] Update all environment variables
- [ ] Update Google OAuth URLs for production domains
- [ ] Update Supabase webhook/redirect URLs

---

## 🔍 TROUBLESHOOTING

### Problem: "Something went wrong on the server"
**Solution**:
1. Check backend logs: `npm run dev:backend`
2. Look for red error messages
3. Common causes:
   - Missing env variable
   - Wrong Resend API key format
   - Wrong Google credentials

### Problem: Google Login Shows "Invalid State"
**Solution**:
1. Clear browser cookies/cache
2. Restart backend
3. Try again

### Problem: Welcome Emails Not Arriving
**Solution**:
1. Check spam folder
2. Verify Resend API key is correct
3. Check backend logs for email errors
4. Try signing up with different email

### Problem: Can't Connect to Supabase
**Solution**:
1. Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
2. Test connection: `curl https://ggcqzqnsqbjkzqdnqpaj.supabase.co/rest/v1/`
3. Check internet connection

---

## 📝 CREDENTIAL CHECKLIST

```
CREDENTIALS NEEDED FOR 100% WORKING APP:

Local Development:
[ ] Resend API Key (free, 5 min to get)
[ ] Google OAuth Client ID & Secret (free, 10 min to get)
[ ] Supabase URL & Key (already have ✅)

Production Deploy:
[ ] Vercel account (free)
[ ] Render/Railway account (free tier available)
[ ] Custom domain (optional, costs $)
[ ] SSL certificate (free from Let's Encrypt)
```

---

## 🎯 GETTING CREDENTIALS: QUICK REFERENCE

| Service | What It Is | How Long | Cost | Link |
|---------|-----------|----------|------|------|
| **Resend** | Email API | 2 min | Free | https://resend.com |
| **Google OAuth** | Login service | 10 min | Free | https://console.cloud.google.com |
| **Vercel** | Frontend hosting | 3 min | Free | https://vercel.com |
| **Render** | Backend hosting | 5 min | Free | https://render.com |
| **Railway** | Backend hosting | 5 min | Free | https://railway.app |

---

## ❓ FAQ

**Q: Is my data safe if I share these credentials?**
A: NO! Never share your keys. If exposed:
- Resend API: Regenerate new key immediately
- Google Client Secret: Regenerate immediately
- Supabase Keys: Regenerate from dashboard

**Q: Can I use this locally without these services?**
A: Partially:
- Email signup will work but no welcome emails
- Google OAuth will fail
- Basic email/password login works fine

**Q: How much will this cost?**
A: For most users: **$0/month**
- Resend: Free up to 100 emails/day
- Google OAuth: Free unlimited
- Supabase: Free up to 50MB database
- Vercel: Free up to 100 deployments/month
- Render/Railway: Free tier with limits

**Q: Do I need all these to test locally?**
A: No, minimum for local testing:
- ✅ Resend API (for emails)
- ✅ Google OAuth (for Google login)
- Already have: Supabase

**Q: How do I know if something worked?**
A: Check:
1. Backend logs: `npm run dev:backend`
2. Browser console: Press F12
3. Network tab: See API calls
4. Email inbox: Check if welcome email arrived

---

**Status**: Ready to setup credentials and make 100% working! 🚀

Let me know which step you need help with!
