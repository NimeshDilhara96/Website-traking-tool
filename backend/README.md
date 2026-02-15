# Website Tracking Tool

A simple, privacy-focused website analytics tracking tool built with Node.js, Express, and Supabase.

## Features

- 📊 Track page views automatically
- 🎯 Track custom events
- 📱 Browser information collection
- 🔒 Session-based tracking
- 🚀 Lightweight client-side script
- 💾 Data stored in Supabase
- ⚛️ **Works with ANY framework** (React, Vue, Angular, Svelte, Next.js, etc.)
- 🔄 **Automatic SPA route tracking** (history.pushState, popstate, hashchange)
- 🌐 **Plain HTML & WordPress compatible**

## Setup

### 1. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `setup.sql`
4. Run the SQL script to create the necessary tables and indexes

### 2. Environment Configuration

The `.env` file is already configured with your Supabase credentials:
- SUPABASE_URL
- SUPABASE_ANON_KEY
- PORT (default: 3000)

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## Usage

### Embed Tracking Script on Your Website

Add this script tag to your website's HTML (before the closing `</body>` tag):

```html
<script>
  // Optional: Set your website ID
  window.TRACKING_WEBSITE_ID = 'my-website';
</script>
<script src="http://localhost:3000/track.js"></script>
```

### Automatic Tracking

Once the script is embedded, it will automatically:
- Track page views when the page loads
- Track SPA route changes (React Router, Vue Router, etc.)
- Create/maintain session IDs
- Track when users return to the page (visibility changes)

### Framework Integration

**The tracking script works with ALL frameworks and platforms:**

- ✅ Plain HTML/JavaScript
- ✅ React (Create React App, Vite, Next.js)
- ✅ Vue.js (2, 3, Nuxt)
- ✅ Angular
- ✅ Svelte/SvelteKit
- ✅ WordPress
- ✅ Any other web framework

**Just add the script tag - route changes are tracked automatically!**

See `FRAMEWORK_INTEGRATION.md` for detailed examples with each framework.

### Configuration Options

```html
<script>
  window.TRACKING_WEBSITE_ID = 'your-website-id';  // Required
  window.TRACKING_AUTO_TRACK = true;               // Auto-track page views (default: true)
  window.TRACKING_SPA = true;                      // Track SPA routes (default: true)
  window.TRACKING_DEBUG = false;                   // Debug mode (default: false)
</script>
<script src="http://localhost:3000/track.js"></script>
```

### Track Custom Events

You can track custom events using the global `Analytics` object:

```javascript
// Track a button click
Analytics.trackEvent('button_click', {
  button_id: 'signup-button',
  button_text: 'Sign Up'
});

// Track form submission
Analytics.trackEvent('form_submit', {
  form_name: 'contact_form',
  fields: ['name', 'email', 'message']
});

// Track any custom action
Analytics.trackEvent('video_play', {
  video_id: 'intro-video',
  duration: 120
});
```

## API Endpoints

### Track Page View
```
POST /api/track/pageview
Content-Type: application/json

{
  "url": "https://example.com/page",
  "referrer": "https://google.com",
  "user_agent": "Mozilla/5.0...",
  "screen_resolution": "1920x1080",
  "language": "en-US",
  "session_id": "sess_123",
  "website_id": "my-website"
}
```

### Track Custom Event
```
POST /api/track/event
Content-Type: application/json

{
  "event_name": "button_click",
  "event_data": {
    "button_id": "signup"
  },
  "url": "https://example.com/page",
  "session_id": "sess_123",
  "website_id": "my-website"
}
```

### Get Analytics Data
```
GET /api/analytics/:website_id?start_date=2026-01-01&end_date=2026-12-31
```

Returns:
```json
{
  "success": true,
  "data": {
    "pageviews": [...],
    "events": [...],
    "total_pageviews": 1234,
    "total_events": 567
  }
}
```

### Health Check
```
GET /health
```

## Database Schema

### pageviews table
- `id`: Unique identifier
- `url`: Page URL
- `referrer`: Referrer URL
- `user_agent`: Browser user agent
- `screen_resolution`: Screen resolution (e.g., "1920x1080")
- `language`: Browser language
- `session_id`: Session identifier
- `website_id`: Website identifier
- `timestamp`: Event timestamp

### events table
- `id`: Unique identifier
- `event_name`: Name of the event
- `event_data`: JSON data associated with the event
- `url`: Page URL where event occurred
- `session_id`: Session identifier
- `website_id`: Website identifier
- `timestamp`: Event timestamp

## Production Deployment

For production deployment:

1. Update the `TRACKING_SERVER` URL in `track.js` to your production server URL
2. Set `NODE_ENV=production` in your `.env` file
3. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start index.js --name "analytics-tracker"
   ```

4. Consider adding:
   - Rate limiting middleware
   - Request validation
   - HTTPS/SSL certificates
   - CORS configuration for specific domains

## Security Considerations

- The tracking script uses the Supabase anonymous key, which is safe for client-side use
- Row Level Security (RLS) policies are enabled in the database
- Anonymous users can only INSERT data
- Authenticated users can SELECT data
- Consider implementing additional validation and rate limiting

## License

ISC
