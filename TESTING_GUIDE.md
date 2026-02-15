# Quick Start Guide - Testing Analytics

## 🚀 Step-by-Step Instructions

### 1. Start Backend Server

Open a terminal and run:
```bash
cd e:\analytical\backend
npm start
```

You should see:
```
Tracking server running on port 3000
Tracking script available at: http://localhost:3000/track.js
```

**Leave this terminal running!**

### 2. Start Frontend Dashboard

Open a NEW terminal and run:
```bash
cd e:\analytical\frontend
npm run dev
```

You should see:
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

Open http://localhost:5173 in your browser.

**Leave this terminal running!**

### 3. Start Test Website Server

Open a NEW terminal and run:
```bash
cd e:\analytical\test-website
npm start
```

You should see:
```
🌐 Test website server running on http://localhost:8080
📊 Make sure backend is running on http://localhost:3000
```

### 4. Verify Website ID

1. Go to http://localhost:5173 (Frontend Dashboard)
2. You should see your website in the list
3. Click "View Analytics" 
4. Check the Website ID matches in the test-website HTML files (currently: 7f174381-fafa-4b28-9005-44f4ff92a243)

### 5. Test the Tracking

1. Open http://localhost:8080 in your browser
2. Open Browser Developer Console (F12)
3. You should see console messages:
   - `🚀 Analytics tracking initialized`
   - `📍 Tracking Server: http://localhost:3000`
   - `🆔 Website ID: 7f174381-...`
   - `📊 Tracking: /api/track/pageview`
   - `✅ Tracking successful`

4. Click around the test website:
   - Click "Sign Up Now" button
   - Click feature cards
   - Click the demo event buttons
   - Navigate to About page
   - Navigate to Contact page

5. Check the backend terminal - you should see:
   - `📊 Tracking pageview for website: 7f174381-...`
   - `✅ Pageview tracked successfully`
   - `📊 Tracking event: button_click for website: 7f174381-...`
   - `✅ Event tracked successfully`

### 6. View Analytics

1. Go back to http://localhost:5173
2. Click "View Analytics" for your website
3. You should see:
   - Total page views increasing
   - Total events increasing
   - Recent page views table with data
   - Recent events table with data

## 🔍 Troubleshooting

### Analytics Not Working?

**Check Backend:**
```bash
# Test if backend is responding
curl http://localhost:3000/health
```

**Check Browser Console:**
- Press F12 to open Developer Tools
- Go to Console tab
- Look for any red error messages
- Look for tracking messages (🚀, 📊, ✅)

**Check Network Tab:**
- Open F12 > Network tab
- Reload the test website
- Look for requests to `/api/track/pageview` and `/api/track/event`
- Click on them to see if they're successful (status 200) or failing

**Common Issues:**

1. **CORS errors**: Make sure you're using http://localhost:8080 NOT opening files directly
2. **Website ID mismatch**: Verify the ID in test website matches the dashboard
3. **Backend not running**: Check if port 3000 is being used
4. **Database not set up**: Run setup.sql in Supabase SQL Editor

### Restart Everything

If things aren't working:
1. Stop all terminals (Ctrl+C)
2. Restart backend first
3. Then restart frontend
4. Then restart test website server
5. Refresh browser pages

## ✅ Success Checklist

- [ ] Backend running on port 3000
- [ ] Frontend running on port 5173  
- [ ] Test website running on port 8080
- [ ] Supabase tables created (websites, pageviews, events)
- [ ] Website added in dashboard
- [ ] Website ID matches in test website HTML files
- [ ] Browser console shows tracking messages
- [ ] Backend terminal shows tracking logs
- [ ] Analytics dashboard displays data
