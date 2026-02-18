# 🚀 Deployment Information

## Live URLs

### Frontend (Vercel)
- **URL**: https://websitetrakingtool.vercel.app/
- **Dashboard**: https://vercel.com/dashboard
- **Status**: ✅ Live

### Backend (Render)
- **URL**: https://website-traking-tool.onrender.com
- **Dashboard**: https://dashboard.render.com
- **Status**: ✅ Live
- **Note**: Free tier - may take ~30s to wake up after inactivity

---

## 🔧 Configuration

### Frontend Environment Variables (Vercel)
```
VITE_API_URL=https://website-traking-tool.onrender.com
```

### Backend Environment Variables (Render)
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
PORT=3000
```

### CORS Configuration
Backend allows requests from:
- `https://websitetrakingtool.vercel.app` (Production)
- `http://localhost:5173` (Local dev - Vite)
- `http://localhost:3000` (Local dev - Backend)

---

## 📝 Post-Deployment Checklist

- [x] Backend deployed to Render
- [x] Frontend deployed to Vercel
- [x] CORS configured for production URL
- [ ] Verify frontend can connect to backend
- [ ] Test adding a website
- [ ] Test analytics dashboard
- [ ] Test tracking script on live site

---

## 🧪 Testing Your Deployment

### 1. Test Backend API
```bash
# Health check (if you have a health endpoint)
curl https://website-traking-tool.onrender.com/health

# Get tracking script
curl https://website-traking-tool.onrender.com/track.js

# Test API endpoint
curl https://website-traking-tool.onrender.com/api/websites
```

### 2. Test Frontend
1. Visit: https://websitetrakingtool.vercel.app/
2. Try adding a website
3. Check console for any errors
4. Verify data loads correctly

### 3. Test Full Integration
1. Add a website via dashboard
2. Copy the tracking code
3. Add it to a test website
4. Visit the test website
5. Check if analytics appear in dashboard

---

## 🔄 Update Deployment

### Update Backend (Render)
```bash
# Commit changes
git add backend/
git commit -m "Update backend"
git push

# Render will auto-deploy from GitHub
# Or manually deploy: Dashboard → Your Service → Manual Deploy
```

### Update Frontend (Vercel)
```bash
# Commit changes
git add frontend/
git commit -m "Update frontend"
git push

# Vercel will auto-deploy from GitHub
# Or via CLI:
cd frontend
vercel --prod
```

---

## 🐛 Troubleshooting

### Frontend can't connect to backend
1. Check browser console for CORS errors
2. Verify `VITE_API_URL` is set correctly in Vercel
3. Check backend CORS settings include frontend URL
4. Redeploy frontend if env vars changed

### Backend is slow (first request)
- This is normal for Render free tier
- Service wakes up in ~30 seconds
- Upgrade to paid plan for always-on service ($7/month)

### Changes not showing up
1. Check if deployment succeeded (check dashboard)
2. Hard refresh browser (Ctrl + Shift + R)
3. Clear browser cache
4. Check if correct branch is deployed

### API returns 404
1. Check Render logs: Dashboard → Your Service → Logs
2. Verify backend is running
3. Check API endpoint URLs
4. Verify Supabase credentials are correct

---

## 📊 Monitoring

### Check Backend Logs
- Render Dashboard → Your Service → Logs
- Look for errors or failed requests

### Check Frontend Logs
- Vercel Dashboard → Your Project → Deployments → View Function Logs

### Supabase Database
- Supabase Dashboard → Your Project → Table Editor
- Check if data is being stored correctly

---

## 🔐 Security Notes

- ✅ CORS is configured for specific origins
- ✅ Environment variables are not committed to Git
- ✅ Using Supabase for secure data storage
- ⚠️ Consider adding rate limiting for production
- ⚠️ Consider adding authentication for dashboard access

---

## 💰 Cost Breakdown

### Current Setup (Free Tier)
- **Vercel**: Free (with limits)
- **Render**: Free (with sleep on inactivity)
- **Supabase**: Free tier (500MB database, 2GB file storage)
- **Total**: $0/month

### Recommended Production Setup
- **Vercel Pro**: $20/month (better performance, analytics)
- **Render Starter**: $7/month (always-on, no sleep)
- **Supabase Pro**: $25/month (better limits, support)
- **Total**: ~$52/month

---

## 📱 Share Your Project

Your live app: **https://websitetrakingtool.vercel.app/**

Perfect for:
- Portfolio showcase
- Client demos
- Real-world testing
- Job applications

---

**Last Updated**: February 15, 2026
**Status**: 🟢 All systems operational
