import axios from 'axios';

// Production API URL - NO FALLBACK
const API_BASE_URL = 'https://website-traking-tool.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Website API calls
export const websiteAPI = {
  getAll: async () => {
    const response = await api.get('/api/websites');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/websites/${id}`);
    return response.data;
  },

  create: async (websiteData) => {
    const response = await api.post('/api/websites', websiteData);
    return response.data;
  },

  update: async (id, websiteData) => {
    const response = await api.put(`/api/websites/${id}`, websiteData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/websites/${id}`);
    return response.data;
  },
};

// Analytics API calls
export const analyticsAPI = {
  getAnalytics: async (websiteId, startDate, endDate) => {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const response = await api.get(`/api/analytics/${websiteId}`, { params });
    return response.data;
  },
};

export default api;
