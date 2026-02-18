# 📊 Tracking Script එක Use කරන්නේ කොහොමද?

## 🎯 Quick Start

### 1. Dashboard එකට Login වෙන්න
**URL**: https://websitetrakingtool.vercel.app/

### 2. Website එකක් Add කරන්න
- "Add Website" button එක click කරන්න
- Website name සහ domain දාන්න
- Submit කරන්න

### 3. Tracking Code එක ගන්න
- Your website එක select කරන්න
- "View Analytics" click කරන්න
- **"📊 Tracking Setup"** section එකෙන් code එක copy කරන්න

### 4. ඔබේ Website එකට Add කරන්න
Code එක ඔබේ website එකේ **`</body>` tag එකට පෙර** දාන්න.

---

## 📝 Tracking Code Format

```html
<!-- Add this to your website -->
<script>
  window.TRACKING_WEBSITE_ID = 'your-website-id-here';
</script>
<script src="https://website-traking-tool.onrender.com/track.js"></script>
```

---

## 🔧 Implementation මාර්ගෝපදේශ

### විකල්ප 1: Plain HTML Website

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <h1>Welcome to my website</h1>
    
    <!-- Your content here -->
    
    <!-- Add tracking code before closing body tag -->
    <script>
      window.TRACKING_WEBSITE_ID = 'your-website-id';
    </script>
    <script src="https://website-traking-tool.onrender.com/track.js"></script>
</body>
</html>
```

### විකල්ප 2: React Application

**Method A: public/index.html එකේ**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
    
    <!-- Add before closing body tag -->
    <script>
      window.TRACKING_WEBSITE_ID = 'your-website-id';
    </script>
    <script src="https://website-traking-tool.onrender.com/track.js"></script>
  </body>
</html>
```

**Method B: React Component එකකින් (useEffect වලින්)**
```jsx
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Set website ID
    window.TRACKING_WEBSITE_ID = 'your-website-id';
    
    // Load tracking script
    const script = document.createElement('script');
    script.src = 'https://website-traking-tool.onrender.com/track.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="App">
      {/* Your app content */}
    </div>
  );
}
```

### විකල්ප 3: Next.js Application

**pages/_app.js හෝ app/layout.js:**
```jsx
import Script from 'next/script';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      
      {/* Add tracking scripts */}
      <Script id="tracking-config">
        {`window.TRACKING_WEBSITE_ID = 'your-website-id';`}
      </Script>
      <Script 
        src="https://website-traking-tool.onrender.com/track.js" 
        strategy="afterInteractive"
      />
    </>
  );
}
```

### විකල්ප 4: WordPress Website

**Option A: Theme Footer එකට Add කරන්න**
1. Dashboard → Appearance → Theme Editor
2. `footer.php` file එක open කරන්න
3. `</body>` tag එකට පෙර tracking code එක දාන්න
4. Save කරන්න

**Option B: Plugin එකක් Use කරන්න (Insert Headers and Footers)**
1. Install "Insert Headers and Footers" plugin
2. Settings → Insert Headers and Footers
3. "Footer" section එකට tracking code එක paste කරන්න
4. Save කරන්න

### විකල්ප 5: Vue.js Application

**public/index.html:**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Vue App</title>
  </head>
  <body>
    <div id="app"></div>
    
    <!-- Add tracking code -->
    <script>
      window.TRACKING_WEBSITE_ID = 'your-website-id';
    </script>
    <script src="https://website-traking-tool.onrender.com/track.js"></script>
  </body>
</html>
```

### විකල්ප 6: Angular Application

**src/index.html:**
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Angular App</title>
</head>
<body>
  <app-root></app-root>
  
  <!-- Add tracking code -->
  <script>
    window.TRACKING_WEBSITE_ID = 'your-website-id';
  </script>
  <script src="https://website-traking-tool.onrender.com/track.js"></script>
</body>
</html>
```

---

## 🎯 Advanced Usage

### Custom Event Tracking

Dashboard වලින් පෙන්වන tracking code එක add කරලා වුන පසු, custom events track කරන්න පුළුවන්:

```javascript
// Track button click
document.getElementById('signup-btn').addEventListener('click', function() {
  window.Analytics.trackEvent('Signup Button Clicked', {
    button_location: 'header',
    page: window.location.pathname
  });
});

// Track form submission
document.getElementById('contact-form').addEventListener('submit', function(e) {
  window.Analytics.trackEvent('Contact Form Submitted', {
    form_id: 'contact-form',
    user_type: 'visitor'
  });
});

// Track video play
document.getElementById('video').addEventListener('play', function() {
  window.Analytics.trackEvent('Video Started', {
    video_id: 'intro-video',
    duration: this.duration
  });
});

// Track purchase
function trackPurchase(amount, productId) {
  window.Analytics.trackEvent('Purchase Completed', {
    amount: amount,
    product_id: productId,
    currency: 'USD'
  });
}
```

### React Component එකක Custom Events

```jsx
function SignupButton() {
  const handleClick = () => {
    // Track the event
    if (window.Analytics) {
      window.Analytics.trackEvent('Signup Clicked', {
        component: 'SignupButton',
        page: window.location.pathname
      });
    }
    
    // Your signup logic
    handleSignup();
  };

  return <button onClick={handleClick}>Sign Up</button>;
}
```

### Manual Page View Tracking (Auto-tracking disable කරලා නම්)

```javascript
// Disable auto-tracking
window.TRACKING_AUTO_TRACK = false;

// Load the script
<script src="https://website-traking-tool.onrender.com/track.js"></script>

// Manually track page views
window.Analytics.trackPageView();

// Track specific URL
window.Analytics.trackPageView('https://mysite.com/custom-page');
```

---

## 🔍 Verify Tracking is Working

### Method 1: Browser Console
1. Open browser console (F12)
2. Look for these messages:
   ```
   🚀 Analytics tracking initialized
   📍 Tracking Server: https://website-traking-tool.onrender.com
   🆔 Website ID: your-website-id
   📊 Tracking: /api/track/pageview
   ✅ Tracking successful
   ```

### Method 2: Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Refresh the page
4. Look for requests to `website-traking-tool.onrender.com`
5. Check if `/api/track/pageview` returns 200 OK

### Method 3: Dashboard
1. Visit https://websitetrakingtool.vercel.app/
2. Select your website
3. Click "View Analytics"
4. Check if page views are appearing

---

## 🐛 Troubleshooting

### Tracking එක work කරන්නේ නෑ

**Problem 1: Script load වෙන්නේ නෑ**
```
Error: Failed to load script
```
**Solution**: Backend URL එක හරිද බලන්න. Render service එක wake එයිද බලන්න.

**Problem 2: CORS error**
```
Access to fetch has been blocked by CORS policy
```
**Solution**: Your website domain එක backend CORS settings වල add කරන්න ඕන. Backend එකේ `index.js` වල:
```javascript
app.use(cors({
  origin: ['https://your-website.com', 'https://websitetrakingtool.vercel.app'],
  // ...
}));
```

**Problem 3: Website ID එක set වෙන්නේ නෑ**
```
🆔 Website ID: default
```
**Solution**: `window.TRACKING_WEBSITE_ID` tracking script load වෙන්න **කලින්** set කරන්න ඕන.

**Problem 4: Tracking data dashboard එකේ පෙන්වන්නේ නෑ**
- Supabase database connection එක හරිද බලන්න
- Backend logs check කරන්න (Render dashboard)
- Browser console එකේ errors තියෙනවද බලන්න

---

## 📊 What Gets Tracked Automatically?

✅ **Auto-tracked:**
- Page views (every time a page loads)
- Route changes (in SPAs like React, Vue, etc.)
- Browser back/forward navigation
- URL hash changes
- Page visibility (when user returns to tab)

ℹ️ **Session බව:**
- URL
- Referrer (කොහෙන් ආනේද)
- User agent (browser type)
- Screen resolution
- Language
- Session ID (browser session එකක් පුරා same)

---

## 🔐 Privacy Features

- ❌ No cookies used
- ❌ No personal data collected
- ❌ No IP addresses stored
- ✅ Session-based tracking only
- ✅ Privacy-focused analytics

---

## 💡 Tips

1. **Multiple Websites**: එක එක websites වලට වෙනම IDs ලැබෙනවා. Dashboard එකෙන් manage කරන්න පුළුවන්.

2. **Testing**: Development වලදී `window.TRACKING_DEBUG = true;` set කරන්න console messages බලන්න.

3. **Performance**: Tracking script එක lightweight (`~5KB`) සහ page load time එකට බලපානවා නෑ.

4. **Backend Sleep**: Render free tier එක sleep වෙනවා. පළමු tracking request එකට ~30s ගත වෙනවා.

---

## 📱 Example: Complete Implementation

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Awesome Website</title>
</head>
<body>
    <header>
        <h1>Welcome!</h1>
        <button id="cta-btn">Sign Up Now</button>
    </header>
    
    <main>
        <section>
            <h2>Our Services</h2>
            <p>Content here...</p>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2026 My Website</p>
    </footer>
    
    <!-- Analytics Tracking Code -->
    <script>
      // Set your website ID (get this from dashboard)
      window.TRACKING_WEBSITE_ID = 'abc123xyz';
      
      // Optional: Enable debug mode for testing
      // window.TRACKING_DEBUG = true;
    </script>
    <script src="https://website-traking-tool.onrender.com/track.js"></script>
    
    <!-- Custom Event Tracking -->
    <script>
      document.getElementById('cta-btn').addEventListener('click', function() {
        window.Analytics.trackEvent('CTA Button Clicked', {
          location: 'header',
          button_text: 'Sign Up Now'
        });
      });
    </script>
</body>
</html>
```

---

**ප්‍රශ්න තිබේද?** Check [DEPLOYMENT_INFO.md](DEPLOYMENT_INFO.md) හෝ backend logs බලන්න.

**Dashboard**: https://websitetrakingtool.vercel.app/
