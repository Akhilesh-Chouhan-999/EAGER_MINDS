# 🔧 DEBUGGING & TROUBLESHOOTING GUIDE

## How to Troubleshoot Issues Step-by-Step

### 📍 Finding Error Messages

#### Step 1: Check Backend Console
```bash
# Terminal where you ran: npm run dev:backend

Look for RED TEXT with:
❌ Error
⚠️  Warning
🔴 Failed
```

#### Step 2: Check Frontend Console
```
1. Open browser
2. Press: F12
3. Click: "Console" tab
4. Look for RED ERROR MESSAGES
```

#### Step 3: Check Network Tab
```
1. Press: F12
2. Click: "Network" tab
3. Try your action (e.g., click signup)
4. Look for RED requests (failed)
5. Click on failed request
6. Check "Response" tab for error details
```

---

## Common Issues & Fixes

### ❌ Issue 1: "Cannot find module 'express'"

**Where you see it**: Backend console shows red error

**Why it happens**: node_modules not installed

**Fix**:
```bash
cd backend
npm install
cd ..
npm run dev:backend
```

---

### ❌ Issue 2: "Port 5000 already in use"

**Where you see it**: Backend console says "EADDRINUSE"

**Why it happens**: Another process using port 5000

**Fix - Option A (Windows)**:
```powershell
# Find process using port 5000
netstat -ano | findstr ":5000"

# Kill it (replace PID with number from above)
taskkill /PID [PID] /F

# Then restart
npm run dev:backend
```

**Fix - Option B (Mac/Linux)**:
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Then restart
npm run dev:backend
```

---

### ❌ Issue 3: "Cannot GET /api/bookmarks"

**Where you see it**: Network tab shows 404 error when clicking API call

**Why it happens**: 
- Backend not running, OR
- Clicked API endpoint that doesn't exist

**Fix**:
```bash
# Check backend is running
curl http://localhost:5000/health

# Should see: {"status":"ok",...}

# If not, start backend:
npm run dev:backend
```

---

### ❌ Issue 4: "CORS error" or "No 'Access-Control-Allow-Origin'"

**Where you see it**: Frontend console shows CORS error

**Why it happens**: Frontend and backend not on same origin

**Fix**:
```bash
# Check: frontend is on http://localhost:5173
# Check: backend is on http://localhost:5000

# In browser address bar:
http://localhost:5173  ← Frontend
http://localhost:5000  ← Backend (check /health)
```

---

### ❌ Issue 5: "Invalid login credentials"

**Where you see it**: Login page shows error message

**Why it happens**: 
- Wrong email/password, OR
- User doesn't exist

**Fix**:
1. Go to signup first
2. Create new test account
3. Use those credentials to login

---

### ❌ Issue 6: "Something went wrong on the server"

**Where you see it**: App shows generic error

**Why it happens**: Backend error not caught properly

**Fix**:
1. Check backend console (npm run dev:backend)
2. Look for detailed error message in red
3. Common causes:
   - Missing env variable
   - Wrong database credentials
   - Wrong API key

---

### ❌ Issue 7: "Email not sending"

**Where you see it**: Sign up works but no email arrives

**Why it happens**: 
- Resend API key wrong
- Email marked as spam
- Resend account has issues

**Fix**:
1. Check backend console for: "Failed to send email"
2. Verify Resend API key:
   - Go to https://resend.com → API Keys
   - Copy again (maybe you missed a character)
   - Paste into backend/.env
   - Restart backend
3. Check spam folder
4. Try with different email

**Test Resend**:
```bash
# Check if key is set
grep "RESEND_API_KEY" backend/.env

# Should show: RESEND_API_KEY=re_abc123...
```

---

### ❌ Issue 8: "Google login shows blank page"

**Where you see it**: Click "Sign up with Google" → nothing happens

**Why it happens**:
- Google credentials wrong
- Not configured in Supabase
- Browser blocking popups

**Fix**:
1. Check console (F12) for errors
2. Verify Google Client ID in backend/.env
   ```
   grep "GOOGLE_CLIENT_ID" backend/.env
   ```
3. Verify in Supabase:
   - Supabase Dashboard → Auth → Providers → Google
   - Check "Enable" is ON
   - Check Client ID and Secret are filled
4. Restart backend
5. Disable popup blocker (if browser shows notification)

---

### ❌ Issue 9: "Cannot connect to Supabase"

**Where you see it**: Signup/Login fails, console shows Supabase error

**Why it happens**:
- Wrong Supabase URL
- Wrong API key
- Database not initialized

**Fix**:
```bash
# Check Supabase URL
grep "SUPABASE_URL" backend/.env

# Should show: SUPABASE_URL=https://xxxxx.supabase.co

# Test connection
curl https://xxxxx.supabase.co/rest/v1/

# If that fails, check:
# 1. URL is correct (copy from Supabase dashboard again)
# 2. Internet connection works
# 3. Supabase project is active
```

---

### ❌ Issue 10: "Database schema not found"

**Where you see it**: Signup/Login returns error "table bookmarks not found"

**Why it happens**: SQL schema not run in Supabase

**Fix**:
1. Go to: https://supabase.com → Your Project
2. Click: "SQL Editor" (left menu)
3. Click: "New Query"
4. Copy-paste entire content of: `context/schema.sql`
5. Click: "RUN"
6. Should see green checkmarks
7. Restart backend
8. Try signup again

---

## 🔍 Step-by-Step Debugging Process

### When Something Doesn't Work:

#### Step 1: Identify the Problem
```
Question: What were you doing when it failed?
Example: I clicked "Sign up" and got an error
```

#### Step 2: Where Does the Error Show?
```
Frontend console?  F12 → Console tab
Backend console?   Terminal window
Network request?   F12 → Network tab
Email not sent?    Check spam folder
```

#### Step 3: Check Obvious Things
```
- Is backend running? npm run dev:backend
- Is frontend running? npm run dev:frontend  
- Are env variables set? Check backend/.env
- Is port in use? netstat -ano | findstr ":5000"
- Is internet working? Can you reach google.com?
```

#### Step 4: Find the Error Message
```
Read it carefully!
- What does it say exactly?
- Does it show a line number?
- Does it mention a file?
```

#### Step 5: Google the Error
```
Copy-paste the exact error into Google
Look for Stack Overflow or GitHub issues
```

#### Step 6: Check This Guide
```
Ctrl+F to search this file for your error
```

---

## 📊 Diagnostic Checklist

Copy this and fill it out:

```
□ Backend running? (npm run dev:backend)
  http://localhost:5000/health shows: _______

□ Frontend running? (npm run dev:frontend)
  http://localhost:5173 shows: _______

□ Backend console error?
  Paste error here: _______

□ Frontend console error? (F12)
  Paste error here: _______

□ What action caused the error?
  I clicked: _______

□ What did you expect to happen?
  Should have: _______

□ What actually happened?
  Instead: _______

□ Backend environment variables:
  RESEND_API_KEY=_______
  GOOGLE_CLIENT_ID=_______
  SUPABASE_URL=_______
```

---

## 🎯 Testing Each Feature

### Test 1: Backend Running
```bash
curl http://localhost:5000/health

Expected: {"status":"ok",...}
Actual: ____________________
```

### Test 2: Signup with Email
```
1. Go to http://localhost:5173/signup
2. Enter test data
3. Click "Sign Up"

Expected: "Successfully signed up!"
Actual: ____________________
```

### Test 3: Check Email
```
1. Check your inbox
2. Look in spam folder

Expected: Welcome email received
Actual: ____________________
```

### Test 4: Login
```
1. Go to http://localhost:5173/login
2. Enter email and password
3. Click "Login"

Expected: Redirected to dashboard
Actual: ____________________
```

### Test 5: Google Login
```
1. Go to http://localhost:5173/signup
2. Click "Sign up with Google"
3. Select your Google account
4. Grant permissions

Expected: Redirected to dashboard
Actual: ____________________
```

### Test 6: Add Bookmark
```
1. On dashboard
2. Click to add bookmark
3. Enter URL and title
4. Click "Add"

Expected: Bookmark appears in list
Actual: ____________________
```

---

## 📱 Debug Commands

### Quick Status Check
```bash
# Check if ports are in use
Windows:  netstat -ano | findstr ":5000"
Mac:      lsof -i :5000
Linux:    netstat -tlnp | grep :5000

# Check environment variables
Windows:  type backend\.env
Mac/Linux: cat backend/.env

# Test backend
curl http://localhost:5000/health

# Test database connection
curl https://ggcqzqnsqbjkzqdnqpaj.supabase.co/rest/v1/

# Check npm versions
npm --version
node --version
```

### View Logs
```bash
# Backend logs (in backend console)
npm run dev:backend

# Frontend logs (browser F12 console)
Press F12 in browser

# System logs
# Windows: Event Viewer (search in Start menu)
# Mac: Console app
# Linux: journalctl or /var/log/
```

---

## 🆘 LAST RESORT: Full Reset

If everything is broken, try this:

```bash
# 1. Stop all processes
# Ctrl+C in all terminals

# 2. Clear caches
rm -rf node_modules backend/node_modules frontend/node_modules
rm package-lock.json backend/package-lock.json frontend/package-lock.json

# 3. Reinstall
npm run setup

# 4. Check env files
cat backend/.env      # Should have all 4 variables
cat frontend/.env.local # Should have 1 variable

# 5. Start fresh
npm run dev

# 6. Test
curl http://localhost:5000/health
# Open http://localhost:5173
```

---

## 📞 Getting Help

If still stuck, share:
1. **Error message** (exact text)
2. **What you were doing** (step-by-step)
3. **Backend console output** (paste red errors)
4. **Frontend console output** (F12)
5. **Environment variables** (grep from .env files, hide secrets)

---

**Remember: Check console output FIRST! 99% of errors are explained there.** 🔍
