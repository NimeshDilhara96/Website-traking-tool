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

  // Generate or retrieve visitor ID (persistent across sessions)
  function getVisitorId() {
    let visitorId = localStorage.getItem('tracking_visitor_id');
    let isNew = false;
    
    if (!visitorId) {
      visitorId = 'vis_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('tracking_visitor_id', visitorId);
      localStorage.setItem('tracking_first_visit', new Date().toISOString());
      isNew = true;
    }
    
    return { visitorId, isNew };
  }

  // Parse User Agent for device/browser info
  function parseUserAgent() {
    const ua = navigator.userAgent;
    const result = {
      device_type: 'desktop',
      browser_name: 'Unknown',
      browser_version: '',
      os_name: 'Unknown',
      os_version: '',
      is_mobile: false
    };

    // Detect device type
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      result.device_type = 'tablet';
    } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      result.device_type = 'mobile';
      result.is_mobile = true;
    }

    // Detect browser
    if (ua.indexOf('Firefox') > -1) {
      result.browser_name = 'Firefox';
      result.browser_version = ua.match(/Firefox\/([0-9.]+)/)?.[1] || '';
    } else if (ua.indexOf('Edg') > -1) {
      result.browser_name = 'Edge';
      result.browser_version = ua.match(/Edg\/([0-9.]+)/)?.[1] || '';
    } else if (ua.indexOf('Chrome') > -1) {
      result.browser_name = 'Chrome';
      result.browser_version = ua.match(/Chrome\/([0-9.]+)/)?.[1] || '';
    } else if (ua.indexOf('Safari') > -1) {
      result.browser_name = 'Safari';
      result.browser_version = ua.match(/Version\/([0-9.]+)/)?.[1] || '';
    } else if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident/') > -1) {
      result.browser_name = 'IE';
      result.browser_version = ua.match(/(?:MSIE |rv:)([0-9.]+)/)?.[1] || '';
    }

    // Detect OS
    if (ua.indexOf('Win') > -1) {
      result.os_name = 'Windows';
      if (ua.indexOf('Windows NT 10.0') > -1) result.os_version = '10';
      else if (ua.indexOf('Windows NT 6.3') > -1) result.os_version = '8.1';
      else if (ua.indexOf('Windows NT 6.2') > -1) result.os_version = '8';
      else if (ua.indexOf('Windows NT 6.1') > -1) result.os_version = '7';
    } else if (ua.indexOf('Mac') > -1) {
      result.os_name = 'macOS';
      result.os_version = ua.match(/Mac OS X ([0-9_]+)/)?.[1]?.replace(/_/g, '.') || '';
    } else if (ua.indexOf('X11') > -1 || ua.indexOf('Linux') > -1) {
      result.os_name = 'Linux';
    } else if (ua.indexOf('Android') > -1) {
      result.os_name = 'Android';
      result.os_version = ua.match(/Android ([0-9.]+)/)?.[1] || '';
    } else if (ua.indexOf('iOS') > -1 || ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) {
      result.os_name = 'iOS';
      result.os_version = ua.match(/OS ([0-9_]+)/)?.[1]?.replace(/_/g, '.') || '';
    }

    return result;
  }

  // Extract UTM parameters from URL
  function getUTMParameters(url) {
    const urlObj = new URL(url || window.location.href);
    return {
      utm_source: urlObj.searchParams.get('utm_source') || null,
      utm_medium: urlObj.searchParams.get('utm_medium') || null,
      utm_campaign: urlObj.searchParams.get('utm_campaign') || null,
      utm_term: urlObj.searchParams.get('utm_term') || null,
      utm_content: urlObj.searchParams.get('utm_content') || null
    };
  }

  // Get performance metrics
  function getPerformanceMetrics() {
    if (!window.performance || !window.performance.timing) {
      return {};
    }

    const timing = window.performance.timing;
    const navigation = window.performance.getEntriesByType('navigation')[0];

    const metrics = {
      page_load_time: timing.loadEventEnd - timing.navigationStart,
      ttfb: timing.responseStart - timing.requestStart
    };

    // Get paint metrics (FCP, LCP)
    const paintEntries = window.performance.getEntriesByType('paint');
    paintEntries.forEach(entry => {
      if (entry.name === 'first-contentful-paint') {
        metrics.fcp = Math.round(entry.startTime);
      }
    });

    // Try to get LCP
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        metrics.lcp = Math.round(lastEntry.startTime);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // LCP not supported
    }

    return metrics;
  }

  // Get timezone
  function getTimezone() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
      return null;
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
    const deviceInfo = parseUserAgent();
    const utmParams = getUTMParameters();
    const perfMetrics = getPerformanceMetrics();
    const { visitorId, isNew } = getVisitorId();

    return {
      // Basic info
      url: window.location.href,
      referrer: document.referrer || 'direct',
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      language: navigator.language || navigator.userLanguage,
      
      // Session & visitor tracking
      session_id: getSessionId(),
      visitor_id: visitorId,
      is_new_visitor: isNew,
      website_id: WEBSITE_ID,
      
      // Device & browser
      ...deviceInfo,
      
      // UTM parameters
      ...utmParams,
      
      // Performance metrics
      ...perfMetrics,
      
      // Additional info
      timezone: getTimezone(),
      
      // Timestamp
      timestamp: new Date().toISOString()
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
  let maxScrollDepth = 0;
  let pageStartTime = Date.now();
  let scrollDepths = [25, 50, 75, 100];
  let trackedDepths = new Set();

  // Track scroll depth
  function trackScrollDepth() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercent = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);
    
    maxScrollDepth = Math.max(maxScrollDepth, scrollPercent);
    
    // Track milestone depths
    scrollDepths.forEach(depth => {
      if (scrollPercent >= depth && !trackedDepths.has(depth)) {
        trackedDepths.add(depth);
        trackEvent('scroll_depth', { depth: depth, url: window.location.href });
      }
    });
  }

  // Calculate time on page
  function getTimeOnPage() {
    return Math.round((Date.now() - pageStartTime) / 1000); // in seconds
  }

  // Send time on page when user leaves
  function sendTimeOnPage() {
    const timeOnPage = getTimeOnPage();
    const data = {
      event_name: 'time_on_page',
      event_data: {
        time_on_page: timeOnPage,
        scroll_depth: maxScrollDepth,
        url: window.location.href
      },
      url: window.location.href,
      session_id: getSessionId(),
      website_id: WEBSITE_ID,
      visitor_id: getVisitorId().visitorId
    };
    
    // Use sendBeacon for reliable tracking when page unloads
    const url = `${TRACKING_SERVER}/api/track/event`;
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, blob);
    } else {
      sendTrackingData('/api/track/event', data);
    }
  }

  // Track route changes (for SPAs)
  function trackRouteChange() {
    const currentUrl = window.location.href;
    
    // Prevent tracking the same URL multiple times
    if (currentUrl === lastTrackedUrl) {
      debug('Skipping duplicate page view:', currentUrl);
      return;
    }
    
    // Send time on page for previous page
    if (lastTrackedUrl) {
      sendTimeOnPage();
    }
    
    lastTrackedUrl = currentUrl;
    
    // Reset tracking variables
    maxScrollDepth = 0;
    trackedDepths.clear();
    pageStartTime = Date.now();
    
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

    // Track scroll depth
    let scrollTimeout;
    window.addEventListener('scroll', function() {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(trackScrollDepth, 150);
    }, { passive: true });

    // Track time on page when user leaves
    window.addEventListener('beforeunload', sendTimeOnPage);
    window.addEventListener('pagehide', sendTimeOnPage);

    // Track page visibility changes (user returns to tab)
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        sendTimeOnPage();
      } else {
        trackEvent('page_visible');
        pageStartTime = Date.now(); // Reset timer when user returns
      }
    });

    // Track clicks on outbound links
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a');
      if (link && link.href) {
        try {
          const url = new URL(link.href);
          const currentHost = window.location.hostname;
          
          if (url.hostname !== currentHost) {
            trackEvent('outbound_click', {
              url: link.href,
              text: link.textContent?.trim() || 'Unknown'
            });
          }
        } catch (err) {
          // Invalid URL
        }
      }
    }, { passive: true });
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
    getSessionId: getSessionId,
    // Get visitor ID
    getVisitorId: getVisitorId,
    // Get current scroll depth
    getScrollDepth: function() {
      return maxScrollDepth;
    },
    // Get time on current page
    getTimeOnPage: getTimeOnPage
  };

  console.log('🚀 Analytics tracking initialized');
  console.log('📍 Tracking Server:', TRACKING_SERVER);
  console.log('🆔 Website ID:', WEBSITE_ID);

  // Auto-initialize
  init();
})();
