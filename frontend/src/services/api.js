const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Generic fetch wrapper with error handling
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Website Management
export const websiteAPI = {
  // Get all websites
  getAll: async () => {
    return fetchAPI('/api/websites');
  },

  // Get single website
  getById: async (id) => {
    return fetchAPI(`/api/websites/${id}`);
  },

  // Create new website
  create: async (name, domain) => {
    return fetchAPI('/api/websites', {
      method: 'POST',
      body: JSON.stringify({ name, domain }),
    });
  },

  // Update website
  update: async (id, name, domain) => {
    return fetchAPI(`/api/websites/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, domain }),
    });
  },

  // Delete website
  delete: async (id) => {
    return fetchAPI(`/api/websites/${id}`, {
      method: 'DELETE',
    });
  },
};

// Analytics
export const analyticsAPI = {
  // Get analytics for a website
  getByWebsiteId: async (websiteId, startDate = null, endDate = null) => {
    let url = `/api/analytics/${websiteId}`;
    const params = new URLSearchParams();
    
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return fetchAPI(url);
  },
};

// Get tracking script URL
export const getTrackingScriptUrl = () => {
  return `${API_URL}/track.js`;
};

// Get embed code for a website
export const getTrackingCode = (websiteId) => {
  return `<!-- Website Tracking Code -->
<script>
  window.TRACKING_WEBSITE_ID = '${websiteId}';
  window.TRACKING_AUTO_TRACK = true; // Auto-track page views
  window.TRACKING_SPA = true; // Track Single Page App navigation
  window.TRACKING_DEBUG = false; // Set to true for debugging
</script>
<script src="${API_URL}/track.js" async defer></script>
<!-- End Website Tracking Code -->`;
};

export default {
  websiteAPI,
  analyticsAPI,
  getTrackingScriptUrl,
  getTrackingCode,
};
