# Website Analytics Tracker

A comprehensive, privacy-focused website analytics tracking tool with a professional Google Analytics-style dashboard. Built with Node.js, Express, React, Vite, Tailwind CSS, and Supabase.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

### Core Tracking
- 📊 **Page View Tracking** - Automatically capture every page visit with detailed metadata
- 🎯 **Custom Event Tracking** - Track button clicks, form submissions, and any user interaction
- ⚛️ **Universal Compatibility** - Works with React, Vue, Angular, Svelte, Next.js, plain HTML, WordPress, and more
- 🔄 **Automatic SPA Tracking** - Detects route changes in Single Page Applications
- 🚀 **Lightweight** - Minimal impact on page load times with efficient tracking

### Advanced Analytics
- 📱 **Device Detection** - Automatically identify mobile, tablet, or desktop devices
- 🌐 **Browser & OS Tracking** - Track Chrome, Firefox, Safari, Edge and operating systems
- 🗺️ **Geographic Data** - Capture country, city, region, and timezone information
- 🔗 **UTM Campaign Tracking** - Track utm_source, utm_medium, utm_campaign, utm_term, utm_content
- ⚡ **Performance Metrics** - Monitor page load time, TTFB, FCP, and LCP (Web Vitals)
- 📈 **Scroll Depth Tracking** - Track 25%, 50%, 75%, and 100% scroll milestones
- ⏱️ **Time on Page** - Accurate time tracking with sendBeacon API
- 🔄 **Session Management** - Track session duration, pages per session, and bounce rate
- 👤 **Visitor Intelligence** - Identify new vs returning visitors with persistent visitor IDs
- 🎯 **Outbound Click Tracking** - Monitor external link clicks

### Professional Dashboard
- 📊 **Google Analytics-Style UI** - Modern, intuitive interface with Tailwind CSS
- 📈 **8 Key Metric Cards** - Page views, unique visitors, bounce rate, avg session, sessions, pages/session, new visitors, returning visitors
- 📉 **Interactive Timeline Charts** - 14-day trend visualization with hover tooltips
- 📑 **Tabbed Interface** - Organized sections: Overview, Pages, Sources, Location, Technology
- 📋 **Data Tables** - Sortable tables with hover effects and visual badges
- 🕐 **Recent Activity Feed** - Real-time visitor tracking with device and location info
- 📅 **Date Range Filtering** - Custom date range selection for analytics
- 📋 **Copy Tracking Code** - One-click copy with toast notifications
- 🔒 **Privacy-Focused** - No cookies, session-based tracking
- 💾 **Supabase Backend** - Scalable, secure PostgreSQL data storage

## 📸 Dashboard Features

- **Professional Sidebar** - Modern sidebar with logo, website list, and smooth animations
- **8 Metric Cards** - Beautiful gradient icons showing key analytics at a glance
- **Interactive Charts** - Hover-enabled bar charts with tooltips
- **Tabbed Navigation** - Organized data sections with clean tab interface
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Real-time Updates** - Hot module reloading with instant UI updates

## 🏗️ Project Structure

```
Website-traking-tool/
├── backend/              # Node.js + Express API server
│   ├── index.js         # Main server with analytics endpoints
│   ├── track.js         # Client-side tracking script with device/UTM/performance tracking
│   ├── setup.sql        # Database schema with 30+ tracking fields
│   ├── migration.sql    # Safe migration script for existing databases
│   └── package.json     # Backend dependencies
├── frontend/            # React 19 + Vite + Tailwind CSS dashboard
│   ├── src/
│   │   ├── components/  # React components (Analytics, WebsiteList, WebsiteCard, etc.)
│   │   ├── services/    # API services
│   │   ├── index.css    # Tailwind CSS with custom styles
│   │   └── main.jsx     # App entry point
│   ├── tailwind.config.js  # Tailwind configuration
│   ├── postcss.config.js   # PostCSS configuration
│   └── package.json     # Frontend dependencies
└── docs/                # Documentation (setup guides, integration examples)
```

## 🛠️ Tech Stack

**Backend:**
- Node.js 18+
- Express 4.x
- Supabase (PostgreSQL)
- geoip-lite - Geographic location detection
- CORS enabled for cross-origin requests

**Frontend:**
- React 19.2.4
- Vite 7.3.1
- Tailwind CSS 4.2.0 - Professional UI styling
- @tailwindcss/postcss - PostCSS integration
- Autoprefixer 10.4.24
- Axios - API communication

**Tracking Script:**
- Vanilla JavaScript (zero dependencies)
- Fetch API for data transmission
- sendBeacon API for reliable tracking
- localStorage for visitor persistence
- Performance API for Web Vitals
- MutationObserver for SPA route detection

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

**For New Installations:**
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the SQL from `backend/setup.sql`

**For Existing Databases:**
1. If you already have tables, use `backend/migration.sql` instead
2. This safely adds new columns without dropping existing data
3. Includes: device detection, UTM tracking, performance metrics, session management

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

1. Open http://localhost:5174 (or http://localhost:5173)
2. Click "Add Website" button in the sidebar
3. Enter website name and domain
4. Click "Show Code" in the dashboard
5. Copy the tracking code with one click

### 7. Install Tracking Code

Add to your website before `</head>` tag:

```html
<script>
  window.TRACKING_WEBSITE_ID = 'your-website-id-here';
</script>
<script src="http://localhost:3000/track.js"></script>
```

For production, replace `localhost:3000` with your deployed backend URL.

## 📚 Documentation

- [Environment Setup Guide](ENVIRONMENT_SETUP.md) - How to configure .env files
- [Framework Integration Guide](FRAMEWORK_INTEGRATION.md) - React, Vue, Angular, etc.
- [Quick Reference](QUICK_REFERENCE.md) - Copy-paste examples
- [Testing Guide](TESTING_GUIDE.md) - How to test the tracking

## 🎯 Usage Examples

### Track Custom Events

```javascript
// Button click with custom data
Analytics.trackEvent('button_click', {
  button_name: 'signup',
  page: 'home',
  variation: 'blue-cta'
});

// Form submission
Analytics.trackEvent('form_submit', {
  form_name: 'contact',
  fields_filled: 5
});

// E-commerce events
Analytics.trackEvent('purchase', {
  order_id: 'ORDER-123',
  total: 99.99,
  items: 3,
  payment_method: 'stripe'
});

// Video engagement
Analytics.trackEvent('video_play', {
  video_id: 'intro-tutorial',
  duration: 120
});
```

### Configuration Options

```html
<script>
  window.TRACKING_WEBSITE_ID = 'your-website-id';
  window.TRACKING_AUTO_TRACK = true;  // Auto-track page views (default: true)
  window.TRACKING_SPA = true;         // Track SPA route changes (default: true)
  window.TRACKING_DEBUG = false;      // Console logging (default: false)
</script>
<script src="https://your-backend.onrender.com/track.js"></script>
```

### Automatic Tracking Features

The tracking script automatically captures:
- **Page Views** - Every page load or SPA route change
- **Device Info** - Mobile, tablet, or desktop detection
- **Browser & OS** - Chrome, Firefox, Safari, Edge, Windows, macOS, Linux, iOS, Android
- **Location** - Country, city, region, timezone (via IP)
- **UTM Parameters** - Campaign tracking from URL
- **Performance** - Page load time, TTFB, FCP, LCP
- **Scroll Depth** - 25%, 50%, 75%, 100% milestones
- **Time on Page** - Accurate measurement on page unload
- **Outbound Clicks** - External link tracking
- **Visitor ID** - Persistent across sessions (localStorage)

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
| GET | `/track.js` | Tracking script (JavaScript) |
| POST | `/api/track/pageview` | Track page view with 30+ data points |
| POST | `/api/track/event` | Track custom event with metadata |
| GET | `/api/websites` | List all tracked websites |
| POST | `/api/websites` | Create new website |
| GET | `/api/analytics/:id` | Get analytics with calculated metrics |
| DELETE | `/api/websites/:id` | Delete website and its data |

### Analytics Response Includes:
- Total pageviews, unique visitors, sessions
- Bounce rate, avg session duration, pages per session
- New vs returning visitor counts
- Detailed pageviews array with all tracking data
- Custom events array

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

## 🎨 Dashboard Highlights

- **Modern Sidebar Layout** - Collapsible navigation with gradient logo
- **8 Beautiful Stat Cards** - Color-coded with gradient icons (blue, green, yellow, purple, indigo, pink, teal, orange)
- **Interactive Timeline Chart** - Last 14 days with hover tooltips
- **5 Data Tabs** - Overview, Pages, Sources, Location, Technology
- **Recent Activity Table** - Real-time visitor feed with badges
- **Date Range Filter** - Custom analytics periods
- **One-Click Copy** - Tracking code with toast notifications
- **Fully Responsive** - Mobile, tablet, and desktop optimized
- **Dark Code Blocks** - Professional syntax display
- **Loading States** - Smooth spinners and transitions

## 📦 Database Schema

**4 Main Tables:**
1. **websites** - Tracked websites (id, name, domain, created_at)
2. **pageviews** - 30+ columns including device, browser, OS, country, city, UTM params, performance metrics, scroll depth, time on page
3. **sessions** - Session tracking (visitor_id, pageview_count, duration, is_bounce, first/last seen)
4. **events** - Custom event tracking (event_name, event_data, visitor_id)

**8 Performance Indexes** for fast queries on:
- visitor_id, device_type, country, utm_source, utm_campaign, is_new_visitor, session_id, event_name

---

**⭐ If you find this project useful, please give it a star!**
