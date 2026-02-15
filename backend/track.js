(function() {
  'use strict';

  // Configuration - Replace with your tracking server URL
  const TRACKING_SERVER = 'https://website-traking-tool.onrender.com';
  const WEBSITE_ID = window.TRACKING_WEBSITE_ID || 'default';
  const CONFIG = {
    autoTrack: window.TRACKING_AUTO_TRACK !== false, // Auto-track page views
    trackSPA: window.TRACKING_SPA !== false, // Track Single Page App navigation
    debug: window.TRACKING_DEBUG === true // Enable debug logging
  };

  // Debug logging
  function debug(...args) {
    if (CONFIG.debug) {
      console.log('[Analytics]', ...args);
    }
  }

  // Generate or retrieve session ID
  function getSessionId() {
    let sessionId = sessionStorage.getItem('tracking_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('tracking_session_id', sessionId);
    }
    return sessionId;
  }

  // Get browser information
  function getBrowserInfo() {
    return {
      url: window.location.href,
      referrer: document.referrer || 'direct',
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      language: navigator.language || navigator.userLanguage,
      session_id: getSessionId(),
      website_id: WEBSITE_ID
    };
  }

  // Send tracking data
  function sendTrackingData(endpoint, data) {
    console.log('📊 Tracking:', endpoint, data);
    
    const url = `${TRACKING_SERVER}${endpoint}`;
    debug('Sending request to:', url);
    
    // Always use fetch for better error handling and CORS support
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      keepalive: true
    })
    .then(response => {
      debug('Response status:', response.status, response.statusText);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(result => {
      console.log('✅ Tracking successful:', result);
      debug('Tracking successful:', result);
    })
    .catch(err => {
      console.error('❌ Tracking error:', err.message || err.toString());
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        endpoint: endpoint,
        url: url
      });
      console.error('Failed to track:', endpoint, data);
    });
  }

  // Track page view
  function trackPageView(customUrl) {
    const data = getBrowserInfo();
    if (customUrl) {
      data.url = customUrl;
    }
    sendTrackingData('/api/track/pageview', data);
  }

  // Track custom event
  function trackEvent(eventName, eventData = {}) {
    const data = {
      event_name: eventName,
      event_data: eventData,
      url: window.location.href,
      session_id: getSessionId(),
      website_id: WEBSITE_ID
    };
    sendTrackingData('/api/track/event', data);
  }

  // Store last tracked URL to prevent duplicate tracking
  let lastTrackedUrl = null;

  // Track route changes (for SPAs)
  function trackRouteChange() {
    const currentUrl = window.location.href;
    
    // Prevent tracking the same URL multiple times
    if (currentUrl === lastTrackedUrl) {
      debug('Skipping duplicate page view:', currentUrl);
      return;
    }
    
    lastTrackedUrl = currentUrl;
    debug('Route changed to:', currentUrl);
    trackPageView(currentUrl);
  }

  // Setup SPA tracking (React Router, Vue Router, etc.)
  function setupSPATracking() {
    if (!CONFIG.trackSPA) {
      debug('SPA tracking disabled');
      return;
    }

    debug('Setting up SPA tracking...');

    // Track history.pushState (used by React Router, Vue Router, etc.)
    const originalPushState = history.pushState;
    history.pushState = function() {
      originalPushState.apply(history, arguments);
      debug('pushState detected');
      setTimeout(trackRouteChange, 100); // Small delay for DOM updates
    };

    // Track history.replaceState
    const originalReplaceState = history.replaceState;
    history.replaceState = function() {
      originalReplaceState.apply(history, arguments);
      debug('replaceState detected');
      setTimeout(trackRouteChange, 100);
    };

    // Track browser back/forward buttons
    window.addEventListener('popstate', function() {
      debug('popstate detected');
      setTimeout(trackRouteChange, 100);
    });

    // Track hash changes (for hash-based routing)
    window.addEventListener('hashchange', function() {
      debug('hashchange detected');
      setTimeout(trackRouteChange, 100);
    });

    console.log('✅ SPA tracking enabled - route changes will be tracked automatically');
  }

  // Initialize tracking
  function init() {
    debug('Initializing Analytics...');
    debug('Website ID:', WEBSITE_ID);
    debug('Config:', CONFIG);

    // Auto-track initial page view
    if (CONFIG.autoTrack) {
      if (document.readyState === 'complete') {
        trackRouteChange();
      } else {
        window.addEventListener('load', trackRouteChange);
      }
    }

    // Setup SPA tracking
    setupSPATracking();

    // Track page visibility changes (user returns to tab)
    document.addEventListener('visibilitychange', function() {
      if (!document.hidden) {
        trackEvent('page_visible');
      }
    });
  }

  // Expose tracking functions globally
  window.Analytics = {
    trackEvent: trackEvent,
    trackPageView: trackPageView,
    setWebsiteId: function(id) {
      window.TRACKING_WEBSITE_ID = id;
    },
    // Manual initialization (if autoTrack is disabled)
    init: init,
    // Get current session ID
    getSessionId: getSessionId
  };

  console.log('🚀 Analytics tracking initialized');
  console.log('📍 Tracking Server:', TRACKING_SERVER);
  console.log('🆔 Website ID:', WEBSITE_ID);

  // Auto-initialize
  init();
})();
