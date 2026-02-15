# Quick Integration Guide

## Copy-Paste Solutions for Popular Frameworks

### 📄 Plain HTML
```html
<script>window.TRACKING_WEBSITE_ID = 'your-id';</script>
<script src="http://localhost:3000/track.js"></script>
```

### ⚛️ React (index.html)
```html
<script>window.TRACKING_WEBSITE_ID = 'your-id';</script>
<script src="http://localhost:3000/track.js"></script>
```
Routes are tracked automatically! ✨

### 🎯 Vue (index.html)
```html
<script>window.TRACKING_WEBSITE_ID = 'your-id';</script>
<script src="http://localhost:3000/track.js"></script>
```
Routes are tracked automatically! ✨

### 📐 Angular (index.html)
```html
<script>window.TRACKING_WEBSITE_ID = 'your-id';</script>
<script src="http://localhost:3000/track.js"></script>
```
Routes are tracked automatically! ✨

### ⚡ Next.js (pages/_app.js)
```jsx
import Script from 'next/script';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script id="tracking">
        {`window.TRACKING_WEBSITE_ID = 'your-id';`}
      </Script>
      <Script src="http://localhost:3000/track.js" />
      <Component {...pageProps} />
    </>
  );
}
```

### 🎨 Svelte (app.html)
```html
<script>window.TRACKING_WEBSITE_ID = 'your-id';</script>
<script src="http://localhost:3000/track.js"></script>
```
Routes are tracked automatically! ✨

---

## Track Custom Events (Any Framework)

```javascript
// Button click
window.Analytics.trackEvent('button_click', {
  button: 'signup'
});

// Form submit
window.Analytics.trackEvent('form_submit', {
  form: 'contact'
});

// Any custom event
window.Analytics.trackEvent('event_name', {
  custom: 'data'
});
```

---

## Configuration Options

```javascript
window.TRACKING_WEBSITE_ID = 'your-id';    // Required
window.TRACKING_AUTO_TRACK = true;          // Auto-track page views (default: true)
window.TRACKING_SPA = true;                 // Track SPA routes (default: true)
window.TRACKING_DEBUG = false;              // Debug mode (default: false)
```

---

## See FRAMEWORK_INTEGRATION.md for detailed examples!
