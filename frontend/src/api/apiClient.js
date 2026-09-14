const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to build auth headers and send JSON requests
 */
async function request(endpoint, options = {}) {
  const { params, body, headers = {}, ...customConfig } = options;

  let url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const token = localStorage.getItem('udyam_token');

  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...customConfig,
  };

  if (body) {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const response = await fetch(url, config);
  const contentType = response.headers.get('content-type');
  let data = null;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMessage =
      (typeof data === 'object' && data?.message) ||
      (typeof data === 'object' && data?.error) ||
      (typeof data === 'string' && data) ||
      `Request failed with status ${response.status}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const apiClient = {
  // Auth
  async login(email, password, role) {
    const normalizedRole = role === 'citizen' ? 'user' : role;
    return request('/auth/login', {
      method: 'POST',
      body: { email, password, ...(normalizedRole ? { role: normalizedRole } : {}) },
    });
  },

  async register(registrationData) {
    const data = { ...registrationData };
    if (data.role === 'citizen') {
      data.role = 'user';
    }
    return request('/auth/register', {
      method: 'POST',
      body: data,
    });
  },

  async getMe() {
    const res = await request('/auth/me');
    return res?.user || res;
  },

  // Profile
  async getCurrentProfile() {
    const res = await request('/profile');
    return res?.profile || res;
  },

  async saveProfile(profileData) {
    const res = await request('/profile', {
      method: 'POST',
      body: profileData,
    });
    return res?.profile || res;
  },

  // Public Schemes & Matching
  async getPublicSchemes(params = {}) {
    const res = await request('/schemes', { params });
    return res?.schemes || res;
  },

  async getSchemeById(schemeId) {
    const res = await request(`/schemes/${schemeId}`);
    return res?.scheme || res;
  },

  async matchSchemes(profile) {
    const res = await request('/match');
    return res?.results || res;
  },

  // Saved / Applications Tracker
  async getSavedSchemes(params = {}) {
    const res = await request('/saved', { params });
    return res?.saved || res;
  },

  async toggleSaveScheme(schemeId, status = 'Saved', notes = '') {
    return request('/saved', {
      method: 'POST',
      body: { schemeId, status, notes },
    });
  },

  async updateApplicationStatus(schemeId, status, notes) {
    return request(`/saved/${schemeId}`, {
      method: 'PUT',
      body: { status, notes },
    });
  },

  async removeSavedScheme(schemeId) {
    return request(`/saved/${schemeId}`, {
      method: 'DELETE',
    });
  },

  // Admin APIs
  async getAdminSchemes(params = {}) {
    return request('/admin/schemes', { params });
  },

  async getPendingQueue(params = {}) {
    const res = await request('/admin/pending', { params });
    return res?.pendingSchemes || res;
  },

  async getAdminAnalytics() {
    try {
      return await request('/admin/analytics');
    } catch {
      // Fallback if analytics route is aggregated
      return { success: true };
    }
  },

  async getSchemeHistory(schemeId) {
    return request(`/admin/schemes/${schemeId}/history`);
  },

  async createScheme(schemeData) {
    const res = await request('/admin/schemes', {
      method: 'POST',
      body: schemeData,
    });
    return res?.scheme || res;
  },

  async updateScheme(schemeId, data) {
    const res = await request(`/admin/schemes/${schemeId}`, {
      method: 'PUT',
      body: data,
    });
    return res?.scheme || res;
  },

  async toggleSchemeActive(schemeId) {
    return request(`/admin/schemes/${schemeId}/toggle`, {
      method: 'PATCH',
    });
  },

  async reviewPendingScheme(queueId, action, notes, modifiedData) {
    if (action === 'approve') {
      return request(`/admin/pending/${queueId}/approve`, {
        method: 'POST',
        body: { notes },
      });
    } else if (action === 'reject' || action === 'delete') {
      return request(`/admin/pending/${queueId}`, {
        method: 'DELETE',
      });
    } else {
      return request(`/admin/pending/${queueId}`, {
        method: 'PUT',
        body: modifiedData || { reviewNotes: notes },
      });
    }
  },

  async triggerIngestion(sourceUrl, sourceName) {
    return request('/admin/fetch-url', {
      method: 'POST',
      body: { url: sourceUrl, sourceName },
    });
  },
};

export default apiClient;
