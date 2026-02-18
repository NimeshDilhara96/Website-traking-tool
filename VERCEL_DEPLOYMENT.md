# Vercel වලට Deploy කරන්න කොහොමද 🚀

## 🎯 Quick Start (Render + Vercel)

**1. Backend (Render)** → https://render.com
   - New Web Service
   - Root: `backend` | Start: `node index.js`
   - Add env vars → Deploy
   - Copy URL: `https://your-app.onrender.com`

**2. Frontend (Vercel)** → https://vercel.com  
   - Import repo
   - Root: `frontend`
   - Add env: `VITE_API_URL=https://your-app.onrender.com`
   - Deploy

**Done!** 🎉 Total time: ~10 minutes

---

## විකල්ප 1: Frontend Vercel + Backend Render (Recommended ✅)

### පියවර 1: Backend Deploy කරන්න (Render)

1. **Render Account එකක් හදාගන්න**: https://render.com
2. **New Web Service** click කරන්න
3. GitHub repo එක connect කරන්න (හෝ **Public Git repository** දාන්න)
4. **Service එක configure කරන්න**:
   - **Name**: ඔබේ app එකට නමක් (ex: `website-tracker-api`)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Region**: ලඟම තියෙන region එක select කරන්න
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
5. **Environment Variables** add කරන්න:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_key
   PORT=3000
   ```
6. **Free** plan එක select කරන්න
7. **Create Web Service** click කරන්න
8. Deploy වෙනකම් wait කරන්න (3-5 minutes)
9. **Backend URL එක copy කරගන්න** (ex: `https://your-app.onrender.com`)

**සටහන**: Render free tier එකේ service එක inactive වුන පසු sleep mode එකට යනවා. පළමු request එකට ~30 seconds ගත වෙනවා wake up වෙන්න.

### පියවර 2: Frontend Deploy කරන්න (Vercel)

**විකල්පය A: Vercel Dashboard එකෙන්**

1. **Vercel Account එකක් හදාගන්න**: https://vercel.com
2. **New Project** → **Import Git Repository**
3. GitHub repo එක connect කරන්න
4. **Root Directory**: `frontend` select කරන්න
5. **Framework Preset**: `Vite` (auto-detect වෙන්න ඕන)
6. **Build Settings** (auto-detected):
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
7. **Environment Variables** add කරන්න:
   ```
   VITE_API_URL=https://your-app.onrender.com
   ```
   (Render වලින් ගත්ත backend URL එක මෙතන දාන්න - අන්තයේ `/` එකක් නැතිව)
8. **Deploy** click කරන්න
9. Deploy වෙනකම් wait කරන්න (2-3 minutes)
10. ඔබේ site එක live! 🎉

**විකල්පය B: Vercel CLI එකෙන්**

```bash
# Vercel CLI install කරන්න
npm i -g vercel

# Frontend folder එකට යන්න
cd frontend

# Deploy කරන්න
vercel

# Environment variables add කරන්න prompts වලදී:
# VITE_API_URL = https://your-app.onrender.com

# Production deploy
vercel --prod
```

---

## විකල්ප 2: Frontend + Backend දෙකම Vercel එකේම (Serverless Functions)

### Setup කරන්න:

#### 1. Backend එක Serverless Functions වලට convert කරන්න

Project structure එක මෙහෙම වෙන්න ඕන:
```
Website-traking-tool/
├── api/              # Vercel serverless functions
│   ├── track.js
│   ├── websites.js
│   └── analytics.js
├── frontend/         # React app
└── vercel.json       # Vercel config
```

#### 2. Project root එකේ `vercel.json` හදන්න:
```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/frontend/dist/$1" }
  ]
}
```

#### 3. Deploy කරන්න:
```bash
# Vercel CLI install කරන්න
npm i -g vercel

# Deploy කරන්න
vercel

# Production deploy
vercel --prod
```

---

## විකල්ප 3: Backend Alternative Services

### Backend Deployment Options:

1. **Render** ⭐ (Recommended - Free tier available): https://render.com
   - New Web Service → Connect GitHub
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node index.js`
   - Auto-deploys from GitHub
   - **Note**: Free tier sleeps after inactivity (~30s wake-up time)

2. **Railway** (Free trial available): https://railway.app
   - New Project → Deploy from GitHub
   - Select backend folder
   - Build & Start commands auto-detected
   - Very fast deployment
   - **Note**: Free tier has monthly usage limits

3. **Heroku**: https://heroku.com
   - Create app → Connect GitHub → Deploy branch
   - Add Procfile: `web: node index.js`
   - Move to backend directory for commands
   - **Note**: No free tier (paid plans from $7/month)

4. **DigitalOcean App Platform**: https://www.digitalocean.com/products/app-platform
   - Good for production
   - No free tier ($5/month minimum)

---

## 🔧 Deploy කිරීමට පෙර Check List

- [ ] Backend ENV variables set up කරලාද? (SUPABASE_URL, SUPABASE_ANON_KEY)
- [ ] Frontend ENV variables set up කරලාද? (VITE_API_URL)
- [ ] Supabase database tables සාදලාද? (setup.sql run කරන්න)
- [ ] CORS settings හරිද backend එකේ?
- [ ] package.json files හරිද?
- [ ] .gitignore එකේ .env files තියෙනවද?

---

## 🌐 Deploy වුන පසු Test කරන්න

### Backend Test (Render):
1. Render dashboard එකේ යන්න → Your Service
2. URL එක copy කරන්න (ex: `https://your-app.onrender.com`)
3. Browser එකේ test කරන්න:
   - `https://your-app.onrender.com/track.js` - tracking script එක load වෙනවද?
   - `https://your-app.onrender.com/api/websites` - API working කරනවද?

### Frontend Test (Vercel):
1. Frontend URL එකට යන්න (ex: `https://your-site.vercel.app`)
2. Website එකක් add කරන්න
3. Tracking code එක copy කරලා test website එකකට දාන්න
4. Analytics dashboard එකේ data පෙන්වනවද බලන්න

### Full Integration Test:
```bash
# Backend health check
curl https://your-app.onrender.com/health

# Add test website via API
curl -X POST https://your-app.onrender.com/api/websites \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Site","domain":"test.com"}'

# Check frontend can fetch data
# Open browser console on your Vercel site and check Network tab
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: Backend URL එකට connect වෙන්නේ නෑ
**Fix**: Frontend `.env` file එකේ `VITE_API_URL` හරිද බලන්න. `/` එකක් අන්තයේ නැතිව තියෙන්න ඕන.

### Issue 2: CORS errors
**Fix**: Backend CORS settings වල frontend URL එක add කරන්න:
```javascript
app.use(cors({
  origin: ['https://your-frontend.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Issue 3: Environment variables load වෙන්නේ නෑ
**Fix**: Vercel dashboard එකේ Settings → Environment Variables හරිද check කරන්න. Deploy කරන්න ඕන redeploy කරන්න.

### Issue 4: Render service slow වෙනවා (Free tier)
**Reason**: Free tier services sleep after 15 minutes of inactivity.
**Solutions**:
1. **Accept it**: Development/testing සඳහා හොඳයි
2. **Upgrade**: $7/month paid plan එකෙන් always-on service එකක් ගන්න
3. **Keep-alive ping**: External service එකකින් (ex: UptimeRobot) 10 minutes වලට වරක් ping කරන්න (not recommended)

### Issue 5: Render deployment failed
**Common causes**:
- `package.json` හරියට නෑ
- Start command වැරදියි (should be: `node index.js`)
- Root directory වැරදියි (should be: `backend`)
- Environment variables නෑ

**Fix**: Render logs check කරන්න: Dashboard → Your Service → Logs

---

## 🎯 Quick Deploy Commands

```bash
# Backend (Render)
# Use Render dashboard - no CLI needed for initial setup

# Frontend only (Vercel CLI)
cd frontend
npm i -g vercel
vercel

# Deploy to production with env variable
vercel --prod
# Add VITE_API_URL in Vercel dashboard or during CLI prompts
```

---

## 📚 More Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs) ⭐
- [Railway Documentation](https://docs.railway.app)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Node.js Deployment Guide](https://nodejs.org/en/docs/guides/)

---

## 📝 Quick Reference

### Render Commands & Info:
```bash
# No CLI needed for Render - use dashboard
# Dashboard: https://dashboard.render.com

# View logs:
# Dashboard → Your Service → Logs

# Redeploy:
# Dashboard → Your Service → Manual Deploy → Deploy latest commit

# Environment Variables:
# Dashboard → Your Service → Environment → Add Environment Variable
```

### Vercel Commands:
```bash
# Install CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls

# Add environment variable
vercel env add VITE_API_URL production
```

### Important URLs:
- Render Dashboard: https://dashboard.render.com
- Vercel Dashboard: https://vercel.com/dashboard
- Supabase Dashboard: https://app.supabase.com

---

**සටහන**: 
- **Render free tier**: Service එක inactive වුන පසු sleep mode එකට යනවා. පළමු request එකට ~30 seconds wake up time.
- **Vercel free tier**: Automatic HTTPS, custom domains, unlimited deployments.
- Production use කරන්න නම් සහ better performance එකක් ඕන නම් paid plans එකක් ගන්න හොඳයි.
- **Cost estimate**: Render ($7/month for always-on) + Vercel Pro ($20/month) = $27/month for production-ready setup.
