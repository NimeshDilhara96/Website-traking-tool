# Website Analytics Tracker

A simple, privacy-focused website analytics tracking tool built with Node.js, Express, React, Vite, and Supabase.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

- 📊 **Track page views** - Automatically capture every page visit
- 🎯 **Custom event tracking** - Track button clicks, form submissions, and any user interaction
- ⚛️ **Works with ANY framework** - React, Vue, Angular, Svelte, Next.js, plain HTML, WordPress, etc.
- 🔄 **Automatic SPA tracking** - Detects route changes in Single Page Applications
- 📈 **Real-time dashboard** - Beautiful React dashboard to view all analytics
- 🔒 **Privacy-focused** - No cookies, session-based tracking
- 🚀 **Lightweight** - Minimal impact on page load times
- 💾 **Supabase backend** - Scalable and secure data storage

## 📸 Screenshots

*Add screenshots of your dashboard here*

## 🏗️ Project Structure

```
analytical/
├── backend/              # Node.js + Express API server
│   ├── index.js         # Main server file
│   ├── track.js         # Client-side tracking script
│   ├── setup.sql        # Database schema
│   └── .env.example     # Environment variables template
├── frontend/            # React + Vite dashboard
│   ├── src/
│   │   ├── components/  # React components
│   │   └── services/    # API services
│   └── .env.example     # Environment variables template
└── docs/                # Documentation
```

## 🛠️ Tech Stack

**Backend:**
- Node.js
- Express
- Supabase (PostgreSQL)
- CORS enabled

**Frontend:**
- React 18
- Vite
- Axios
- CSS3

**Tracking:**
- Vanilla JavaScript (no dependencies)
- Fetch API

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works!)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/analytical.git
cd analytical
```

### 2. Set Up Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your Supabase credentials
npm install
```

### 3. Set Up Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env with your backend URL
npm install
```

### 4. Create Database Tables

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the SQL from `backend/setup.sql`

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Add Your First Website

1. Open http://localhost:5173
2. Click "Add Website"
3. Enter website name and domain
4. Copy the tracking code

### 7. Install Tracking Code

Add to your website before `</body>`:

```html
<script>
  window.TRACKING_WEBSITE_ID = 'your-website-id';
</script>
<script src="http://localhost:3000/track.js"></script>
```

## 📚 Documentation

- [Environment Setup Guide](ENVIRONMENT_SETUP.md) - How to configure .env files
- [Framework Integration Guide](FRAMEWORK_INTEGRATION.md) - React, Vue, Angular, etc.
- [Quick Reference](QUICK_REFERENCE.md) - Copy-paste examples
- [Testing Guide](TESTING_GUIDE.md) - How to test the tracking

## 🎯 Usage Examples

### Track Custom Events

```javascript
// Button click
Analytics.trackEvent('button_click', {
  button_name: 'signup',
  page: 'home'
});

// Form submission
Analytics.trackEvent('form_submit', {
  form_name: 'contact'
});

// E-commerce events
Analytics.trackEvent('purchase', {
  order_id: 'ORDER-123',
  total: 99.99
});
```

### Configuration Options

```html
<script>
  window.TRACKING_WEBSITE_ID = 'your-id';
  window.TRACKING_AUTO_TRACK = true;  // Auto-track page views
  window.TRACKING_SPA = true;         // Track SPA routes
  window.TRACKING_DEBUG = false;      // Debug mode
</script>
<script src="http://localhost:3000/track.js"></script>
```

## 🌐 Framework Support

Works seamlessly with:
- ✅ Plain HTML/JavaScript
- ✅ React & Next.js
- ✅ Vue & Nuxt
- ✅ Angular
- ✅ Svelte & SvelteKit
- ✅ WordPress
- ✅ Any other web framework

See [FRAMEWORK_INTEGRATION.md](FRAMEWORK_INTEGRATION.md) for specific examples.

## 🔐 Security

- Environment variables stored in `.env` files (not committed)
- CORS enabled for cross-origin requests
- Row Level Security (RLS) in Supabase
- No sensitive data logged
- Session-based tracking (no personal data)

## 🚀 Deployment

### Backend (Node.js)

**Deploy to:**
- Heroku
- DigitalOcean App Platform
- AWS EC2 / Elastic Beanstalk
- Railway
- Render

Set environment variables in your hosting platform.

### Frontend (React)

**Deploy to:**
- Vercel (recommended for Vite)
- Netlify
- GitHub Pages
- Cloudflare Pages

Update `VITE_API_URL` to your production backend URL.

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/track.js` | Tracking script |
| POST | `/api/track/pageview` | Track page view |
| POST | `/api/track/event` | Track custom event |
| GET | `/api/websites` | List all websites |
| POST | `/api/websites` | Create website |
| GET | `/api/analytics/:id` | Get analytics data |
| DELETE | `/api/websites/:id` | Delete website |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Supabase](https://supabase.com)
- UI inspired by modern analytics platforms
- Thanks to the open-source community

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/analytical](https://github.com/yourusername/analytical)

---

**⭐ If you find this project useful, please give it a star!**
