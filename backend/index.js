require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Middleware
app.use(cors({
  origin: [
    'https://websitetrakingtool.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Serve tracking script
app.get('/track.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(__dirname + '/track.js');
});

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
      website_id
    } = req.body;

    console.log('📊 Tracking pageview for website:', website_id);

    const { data, error } = await supabase
      .from('pageviews')
      .insert([{
        url,
        referrer,
        user_agent,
        screen_resolution,
        language,
        session_id,
        website_id,
        timestamp: new Date().toISOString()
      }]);

    if (error) {
      console.error('❌ Error tracking pageview:', error);
      throw error;
    }

    console.log('✅ Pageview tracked successfully');
    res.status(200).json({ success: true, data });
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
      website_id
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
        timestamp: new Date().toISOString()
      }]);

    if (error) {
      console.error('❌ Error tracking event:', error);
      throw error;
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
      .eq('website_id', website_id);

    if (start_date) query = query.gte('timestamp', start_date);
    if (end_date) query = query.lte('timestamp', end_date);

    const { data: pageviews, error } = await query;

    if (error) throw error;

    // Get events
    let eventQuery = supabase
      .from('events')
      .select('*')
      .eq('website_id', website_id);

    if (start_date) eventQuery = eventQuery.gte('timestamp', start_date);
    if (end_date) eventQuery = eventQuery.lte('timestamp', end_date);

    const { data: events, error: eventError } = await eventQuery;

    if (eventError) throw eventError;

    res.status(200).json({
      success: true,
      data: {
        pageviews,
        events,
        total_pageviews: pageviews.length,
        total_events: events.length
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

// Website Management Endpoints

// Get all websites
app.get('/api/websites', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('websites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching websites:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get a single website
app.get('/api/websites/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('websites')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching website:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new website
app.post('/api/websites', async (req, res) => {
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
      .insert([{ name, domain }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating website:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update a website
app.put('/api/websites/:id', async (req, res) => {
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
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating website:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a website
app.delete('/api/websites/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('websites')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ success: true, message: 'Website deleted successfully' });
  } catch (error) {
    console.error('Error deleting website:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Tracking server running on port ${PORT}`);
  console.log(`Tracking script available at: http://localhost:${PORT}/track.js`);
});
