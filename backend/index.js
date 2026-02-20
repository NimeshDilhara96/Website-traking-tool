require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { createClient } = require('@supabase/supabase-js');
const geoip = require('geoip-lite');
const { authenticateToken } = require('./authMiddleware');
const authController = require('./authController');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or file://)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://websitetrakingtool.vercel.app',
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000'
    ];
    
    // Allow all localhost ports for development
    if (origin.startsWith('http://localhost:') || 
        origin.startsWith('http://127.0.0.1:') ||
        allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now (you can restrict this later)
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Helper function to get client IP address
function getClientIp(req) {
  // Check various headers that might contain the real IP
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, get the first one
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         req.ip;
}

// Helper function to get country from IP
function getCountryFromIp(ip) {
  try {
    // Handle IPv4-mapped IPv6 addresses (e.g., ::ffff:192.168.1.1)
    if (ip && ip.startsWith('::ffff:')) {
      ip = ip.substring(7);
    }
    
    // Skip local IPs
    if (!ip || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return 'Local';
    }
    
    const geo = geoip.lookup(ip);
    if (geo && geo.country) {
      return geo.country;
    }
    return 'Unknown';
  } catch (error) {
    console.error('Error getting country from IP:', error);
    return 'Unknown';
  }
}

// Serve tracking script
app.get('/track.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(__dirname + '/track.js');
});

// Helper function to update or create session
async function updateSession(sessionId, websiteId, visitorId, data) {
  try {
    // Check if session exists
    const { data: existingSession, error: fetchError } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (existingSession) {
      // Update existing session
      const { error: updateError } = await supabase
        .from('sessions')
        .update({
          last_activity_at: new Date().toISOString(),
          pageview_count: (existingSession.pageview_count || 0) + 1,
          is_bounce: existingSession.pageview_count === 0, // More than 1 page = not a bounce
          exit_page: data.url,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (updateError) throw updateError;
    } else {
      // Create new session
      const { error: insertError } = await supabase
        .from('sessions')
        .insert([{
          id: sessionId,
          website_id: websiteId,
          visitor_id: visitorId,
          started_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString(),
          pageview_count: 1,
          event_count: 0,
          is_bounce: true, // Will be updated if more pages are viewed
          entry_page: data.url,
          exit_page: data.url,
          country: data.country,
          city: data.city,
          device_type: data.device_type,
          browser_name: data.browser_name,
          os_name: data.os_name,
          utm_source: data.utm_source,
          utm_medium: data.utm_medium,
          utm_campaign: data.utm_campaign
        }]);

      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error('Error updating session:', error);
    // Don't throw - session tracking is not critical
  }
}

// Track page view
app.post('/api/track/pageview', async (req, res) => {
  try {
    const {
      url,
      referrer,
      user_agent,
      screen_resolution,
      language,
      session_id,
      visitor_id,
      is_new_visitor,
      website_id,
      device_type,
      browser_name,
      browser_version,
      os_name,
      os_version,
      is_mobile,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      page_load_time,
      ttfb,
      fcp,
      lcp,
      timezone,
      timestamp
    } = req.body;

    // Get client IP and detect country/city
    const clientIp = getClientIp(req);
    const country = getCountryFromIp(clientIp);
    
    // Try to get city/region from IP
    let city = null;
    let region = null;
    try {
      if (clientIp && !clientIp.startsWith('192.168.') && !clientIp.startsWith('10.') && clientIp !== '127.0.0.1' && clientIp !== '::1') {
        const ipWithoutIPv6 = clientIp.startsWith('::ffff:') ? clientIp.substring(7) : clientIp;
        const geo = geoip.lookup(ipWithoutIPv6);
        if (geo) {
          city = geo.city || null;
          region = geo.region || null;
        }
      }
    } catch (e) {
      console.error('Error getting city/region:', e);
    }
    
    console.log('📊 Tracking pageview for website:', website_id, 'Visitor:', visitor_id, 'Session:', session_id);

    // Insert pageview
    const { data: pageviewData, error: pageviewError } = await supabase
      .from('pageviews')
      .insert([{
        url,
        referrer,
        user_agent,
        screen_resolution,
        language,
        country,
        city,
        region,
        timezone,
        device_type,
        browser_name,
        browser_version,
        os_name,
        os_version,
        is_mobile,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content,
        page_load_time,
        ttfb,
        fcp,
        lcp,
        visitor_id,
        is_new_visitor,
        is_entry: false, // Will be calculated
        is_exit: false,  // Will be calculated
        session_id,
        website_id,
        timestamp: timestamp || new Date().toISOString()
      }])
      .select();

    if (pageviewError) {
      console.error('❌ Error tracking pageview:', pageviewError);
      throw pageviewError;
    }

    // Update or create session
    await updateSession(session_id, website_id, visitor_id, {
      country,
      city,
      device_type,
      browser_name,
      os_name,
      utm_source,
      utm_medium,
      utm_campaign,
      url
    });

    console.log('✅ Pageview tracked successfully');
    res.status(200).json({ success: true, data: pageviewData });
  } catch (error) {
    console.error('Error tracking pageview:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Track custom event
app.post('/api/track/event', async (req, res) => {
  try {
    const {
      event_name,
      event_data,
      url,
      session_id,
      website_id,
      visitor_id
    } = req.body;

    console.log('📊 Tracking event:', event_name, 'for website:', website_id);

    const { data, error } = await supabase
      .from('events')
      .insert([{
        event_name,
        event_data,
        url,
        session_id,
        website_id,
        visitor_id,
        timestamp: new Date().toISOString()
      }]);

    if (error) {
      console.error('❌ Error tracking event:', error);
      throw error;
    }

    // Update session event count and handle special events
    if (session_id) {
      try {
        const { data: sessionData } = await supabase
          .from('sessions')
          .select('*')
          .eq('id', session_id)
          .single();

        if (sessionData) {
          const updates = {
            event_count: (sessionData.event_count || 0) + 1,
            last_activity_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          // Calculate session duration for time_on_page events
          if (event_name === 'time_on_page' && event_data?.time_on_page) {
            const sessionStart = new Date(sessionData.started_at);
            const now = new Date();
            updates.duration = Math.round((now - sessionStart) / 1000);
          }

          await supabase
            .from('sessions')
            .update(updates)
            .eq('id', session_id);
        }
      } catch (sessionError) {
        console.error('Error updating session for event:', sessionError);
      }
    }

    console.log('✅ Event tracked successfully');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error tracking event:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get analytics data
app.get('/api/analytics/:website_id', async (req, res) => {
  try {
    const { website_id } = req.params;
    const { start_date, end_date } = req.query;

    // Get page views
    let query = supabase
      .from('pageviews')
      .select('*')
      .eq('website_id', website_id)
      .order('timestamp', { ascending: false });

    if (start_date) query = query.gte('timestamp', start_date);
    if (end_date) query = query.lte('timestamp', end_date);

    const { data: pageviews, error } = await query;

    if (error) throw error;

    // Get events
    let eventQuery = supabase
      .from('events')
      .select('*')
      .eq('website_id', website_id)
      .order('timestamp', { ascending: false });

    if (start_date) eventQuery = eventQuery.gte('timestamp', start_date);
    if (end_date) eventQuery = eventQuery.lte('timestamp', end_date);

    const { data: events, error: eventError } = await eventQuery;

    if (eventError) throw eventError;

    // Get sessions
    let sessionQuery = supabase
      .from('sessions')
      .select('*')
      .eq('website_id', website_id)
      .order('started_at', { ascending: false });

    if (start_date) sessionQuery = sessionQuery.gte('started_at', start_date);
    if (end_date) sessionQuery = sessionQuery.lte('started_at', end_date);

    const { data: sessions, error: sessionError } = await sessionQuery;

    if (sessionError) throw sessionError;

    // Calculate metrics
    const uniqueVisitors = new Set(pageviews.map(pv => pv.visitor_id)).size;
    const newVisitors = pageviews.filter(pv => pv.is_new_visitor).length;
    const returningVisitors = uniqueVisitors - newVisitors;
    
    // Calculate bounce rate
    const bouncedSessions = sessions.filter(s => s.is_bounce).length;
    const bounceRate = sessions.length > 0 ? ((bouncedSessions / sessions.length) * 100).toFixed(2) : 0;
    
    // Calculate average session duration
    const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const avgSessionDuration = sessions.length > 0 ? Math.round(totalDuration / sessions.length) : 0;
    
    // Calculate pages per session
    const totalPageviews = pageviews.length;
    const pagesPerSession = sessions.length > 0 ? (totalPageviews / sessions.length).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      data: {
        pageviews,
        events,
        sessions,
        total_pageviews: pageviews.length,
        total_events: events.length,
        total_sessions: sessions.length,
        unique_visitors: uniqueVisitors,
        new_visitors: newVisitors,
        returning_visitors: returningVisitors,
        bounce_rate: bounceRate,
        avg_session_duration: avgSessionDuration,
        pages_per_session: pagesPerSession
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ==============================================
// AUTHENTICATION ENDPOINTS
// ==============================================

// Register new user
app.post('/api/auth/register', authController.register(supabase));

// Login user
app.post('/api/auth/login', authController.login(supabase));

// Get current user (protected)
app.get('/api/auth/me', authenticateToken, authController.getCurrentUser(supabase));

// Verify token
app.get('/api/auth/verify', authenticateToken, authController.verifyToken);

// Logout (client-side will remove token)
app.post('/api/auth/logout', (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// Website Management Endpoints

// Get all websites (protected - only user's websites)
app.get('/api/websites', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('websites')
      .select('*')
      .eq('user_id', req.user.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching websites:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get a single website (protected - only user's website)
app.get('/api/websites/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('websites')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.userId)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ success: false, error: 'Website not found' });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching website:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new website (protected)
app.post('/api/websites', authenticateToken, async (req, res) => {
  try {
    const { name, domain } = req.body;

    if (!name || !domain) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name and domain are required' 
      });
    }

    const { data, error } = await supabase
      .from('websites')
      .insert([{ 
        name, 
        domain,
        user_id: req.user.userId 
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating website:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update a website (protected - only user's website)
app.put('/api/websites/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, domain } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (domain) updateData.domain = domain;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('websites')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', req.user.userId)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ success: false, error: 'Website not found' });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating website:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a website (protected - only user's website)
app.delete('/api/websites/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('websites')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.userId);

    if (error) throw error;

    res.status(200).json({ success: true, message: 'Website deleted successfully' });
  } catch (error) {
    console.error('Error deleting website:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get active users (users with heartbeat in last 45 seconds)
app.get('/api/analytics/:website_id/active', async (req, res) => {
  try {
    const { website_id } = req.params;
    
    // Get heartbeat events from the last 45 seconds
    const fortyFiveSecondsAgo = new Date(Date.now() - 45000).toISOString();
    
    const { data, error } = await supabase
      .from('events')
      .select('session_id, visitor_id, timestamp, event_data')
      .eq('website_id', website_id)
      .eq('event_name', 'heartbeat')
      .gte('timestamp', fortyFiveSecondsAgo)
      .order('timestamp', { ascending: false });

    if (error) throw error;

    // Get unique active users (by session_id)
    const uniqueSessions = new Set();
    const activeUsers = [];
    
    data.forEach(event => {
      if (!uniqueSessions.has(event.session_id)) {
        uniqueSessions.add(event.session_id);
        activeUsers.push({
          session_id: event.session_id,
          visitor_id: event.visitor_id,
          last_seen: event.timestamp,
          page: event.event_data?.page || null,
          time_on_page: event.event_data?.time_on_page || 0,
          scroll_depth: event.event_data?.scroll_depth || 0
        });
      }
    });

    res.status(200).json({ 
      success: true, 
      data: {
        count: activeUsers.length,
        users: activeUsers
      }
    });
  } catch (error) {
    console.error('Error fetching active users:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Tracking server running on port ${PORT}`);
  console.log(`Tracking script available at: http://localhost:${PORT}/track.js`);
});
