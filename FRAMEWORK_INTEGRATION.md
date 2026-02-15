# Framework Integration Guide

The analytics tracking script works with **ANY** HTML website or JavaScript framework. Here's how to integrate it:

---

## ✅ Supports All These Frameworks:

- ✓ Plain HTML/JavaScript
- ✓ React (CRA, Vite, Next.js)
- ✓ Vue.js (2, 3, Nuxt)
- ✓ Angular
- ✓ Svelte/SvelteKit
- ✓ Ember
- ✓ WordPress
- ✓ Django/Flask (with templates)
- ✓ PHP websites
- ✓ Static site generators (Jekyll, Hugo, Gatsby, etc.)

---

## 🚀 Basic Integration (Works Everywhere)

Add this code before the closing `</body>` tag:

```html
<!-- Set your website ID -->
<script>
  window.TRACKING_WEBSITE_ID = 'your-website-id-here';
</script>

<!-- Load tracking script -->
<script src="http://localhost:3000/track.js"></script>
```

That's it! Page views are tracked automatically.

---

## 📱 Single Page Applications (SPA)

### React (with React Router)

**Option 1: Simple (Auto-tracking enabled)**

```jsx
// In your main index.html or App.jsx
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Analytics script is already loaded via <script> tag in index.html
    // It automatically tracks route changes!
  }, []);

  return (
    <Router>
      {/* Your routes */}
    </Router>
  );
}
```

**Option 2: Manual tracking with useLocation**

```jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    if (window.Analytics) {
      window.Analytics.trackPageView();
    }
  }, [location]);

  return (
    <Router>
      {/* Your routes */}
    </Router>
  );
}
```

**Track custom events in React:**

```jsx
function SignupButton() {
  const handleClick = () => {
    // Track the event
    window.Analytics?.trackEvent('button_click', {
      button_name: 'signup',
      page: 'home'
    });
    
    // Your logic here
  };

  return <button onClick={handleClick}>Sign Up</button>;
}
```

---

### Next.js

**pages/_app.js (Pages Router):**

```jsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      window.Analytics?.trackPageView(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      {/* Load tracking script */}
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.TRACKING_WEBSITE_ID = 'your-website-id';`
        }}
      />
      <Script
        src="http://localhost:3000/track.js"
        strategy="afterInteractive"
      />
      
      <Component {...pageProps} />
    </>
  );
}
```

**app/layout.js (App Router):**

```jsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        
        {/* Load tracking script */}
        <Script id="tracking-config">
          {`window.TRACKING_WEBSITE_ID = 'your-website-id';`}
        </Script>
        <Script src="http://localhost:3000/track.js" />
      </body>
    </html>
  );
}
```

---

### Vue.js 3

**main.js:**

```javascript
import { createApp } from 'vue';
import { createRouter } from 'vue-router';
import App from './App.vue';

const router = createRouter({
  // your routes
});

// Track route changes
router.afterEach((to) => {
  if (window.Analytics) {
    window.Analytics.trackPageView(to.fullPath);
  }
});

const app = createApp(App);
app.use(router);
app.mount('#app');
```

**index.html:**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Vue App</title>
  </head>
  <body>
    <div id="app"></div>
    
    <!-- Load tracking script -->
    <script>
      window.TRACKING_WEBSITE_ID = 'your-website-id';
    </script>
    <script src="http://localhost:3000/track.js"></script>
    
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

**Track events in Vue components:**

```vue
<template>
  <button @click="trackSignup">Sign Up</button>
</template>

<script>
export default {
  methods: {
    trackSignup() {
      window.Analytics?.trackEvent('button_click', {
        button_name: 'signup',
        component: 'SignupButton'
      });
    }
  }
}
</script>
```

---

### Angular

**index.html:**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Angular App</title>
</head>
<body>
  <app-root></app-root>
  
  <!-- Load tracking script -->
  <script>
    window.TRACKING_WEBSITE_ID = 'your-website-id';
  </script>
  <script src="http://localhost:3000/track.js"></script>
</body>
</html>
```

**app.component.ts:**

```typescript
import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare global {
  interface Window {
    Analytics: any;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private router: Router) {
    // Track route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (window.Analytics) {
        window.Analytics.trackPageView(event.urlAfterRedirects);
      }
    });
  }

  trackEvent() {
    window.Analytics?.trackEvent('button_click', { 
      button: 'signup' 
    });
  }
}
```

---

### Svelte/SvelteKit

**app.html:**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    %sveltekit.head%
  </head>
  <body>
    <div>%sveltekit.body%</div>
    
    <!-- Load tracking script -->
    <script>
      window.TRACKING_WEBSITE_ID = 'your-website-id';
    </script>
    <script src="http://localhost:3000/track.js"></script>
  </body>
</html>
```

**+layout.svelte:**

```svelte
<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  
  // Track route changes
  $: if ($page.url.pathname && typeof window !== 'undefined') {
    window.Analytics?.trackPageView($page.url.href);
  }
  
  function trackEvent() {
    window.Analytics?.trackEvent('button_click', {
      button: 'signup',
      page: $page.url.pathname
    });
  }
</script>

<slot />
```

---

## ⚙️ Advanced Configuration

### Disable Auto-tracking

If you want to manually control when page views are tracked:

```html
<script>
  window.TRACKING_WEBSITE_ID = 'your-website-id';
  window.TRACKING_AUTO_TRACK = false; // Disable auto-tracking
</script>
<script src="http://localhost:3000/track.js"></script>

<script>
  // Manually track page views when you want
  window.Analytics.trackPageView();
</script>
```

### Enable Debug Mode

```html
<script>
  window.TRACKING_WEBSITE_ID = 'your-website-id';
  window.TRACKING_DEBUG = true; // Enable debug logging
</script>
<script src="http://localhost:3000/track.js"></script>
```

### Disable SPA Tracking

```html
<script>
  window.TRACKING_WEBSITE_ID = 'your-website-id';
  window.TRACKING_SPA = false; // Disable automatic SPA route tracking
</script>
<script src="http://localhost:3000/track.js"></script>
```

---

## 📊 Track Custom Events

Works the same in any framework:

```javascript
// Button click
window.Analytics.trackEvent('button_click', {
  button_id: 'signup-btn',
  button_text: 'Sign Up'
});

// Form submission
window.Analytics.trackEvent('form_submit', {
  form_name: 'contact_form',
  fields: ['name', 'email', 'message']
});

// Video play
window.Analytics.trackEvent('video_play', {
  video_id: '12345',
  video_title: 'Product Demo'
});

// Product view (e-commerce)
window.Analytics.trackEvent('product_view', {
  product_id: 'SKU-12345',
  product_name: 'Blue Widget',
  price: 29.99
});

// Add to cart
window.Analytics.trackEvent('add_to_cart', {
  product_id: 'SKU-12345',
  quantity: 2
});

// Purchase
window.Analytics.trackEvent('purchase', {
  order_id: 'ORDER-789',
  total: 59.98,
  items: 2
});
```

---

## 🔒 Content Security Policy (CSP)

If your site uses CSP, add this to your headers:

```
Content-Security-Policy: 
  script-src 'self' http://localhost:3000;
  connect-src 'self' http://localhost:3000;
```

---

## 🌐 WordPress Integration

Add to your theme's `footer.php` before `</body>`:

```php
<script>
  window.TRACKING_WEBSITE_ID = '<?php echo get_option('analytics_website_id'); ?>';
</script>
<script src="http://localhost:3000/track.js"></script>
```

---

## 🚀 Production Deployment

Replace `http://localhost:3000` with your production server URL:

```html
<script>
  window.TRACKING_WEBSITE_ID = 'your-website-id';
</script>
<script src="https://analytics.yourdomain.com/track.js"></script>
```

---

## ✅ Testing Checklist

1. Open browser Developer Console (F12)
2. Look for: `🚀 Analytics tracking initialized`
3. Navigate between pages
4. Check for: `📊 Tracking: /api/track/pageview`
5. Click buttons with tracking
6. Check for: `✅ Tracking successful`
7. View analytics in dashboard

---

## 📝 Summary

**The tracking script works with ANY website because:**

- ✅ Pure JavaScript (no dependencies)
- ✅ Automatically detects SPA route changes
- ✅ Works with history.pushState/replaceState
- ✅ Works with hash-based routing
- ✅ Global window.Analytics API
- ✅ Non-blocking (won't slow down your site)
- ✅ CORS-friendly
- ✅ Privacy-focused (no cookies)

**You can use it with literally any web technology!**
