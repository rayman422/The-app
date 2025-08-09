export class ApiClient {
  constructor(baseUrl, appId, getAuthToken) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.appId = appId;
    this.getAuthToken = getAuthToken; // async () => token | null
  }

  async request(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    const token = this.getAuthToken ? await this.getAuthToken() : null;
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${this.baseUrl}${path}`, { ...options, headers });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API ${res.status}: ${text}`);
    }
    const contentType = res.headers.get('content-type') || '';
    return contentType.includes('application/json') ? res.json() : res.text();
  }

  // Profile
  getProfile(userId) {
    return this.request(`/users/${userId}/profile`);
  }
  updateProfile(userId, updates) {
    return this.request(`/users/${userId}/profile`, { method: 'PUT', body: JSON.stringify(updates) });
  }

  // Catches
  listCatches(userId) {
    return this.request(`/users/${userId}/catches`);
  }
  createCatch(userId, catchData) {
    return this.request(`/users/${userId}/catches`, { method: 'POST', body: JSON.stringify(catchData) });
  }
  deleteCatch(userId, catchId) {
    return this.request(`/users/${userId}/catches/${catchId}`, { method: 'DELETE' });
  }

  // Signed URL
  getSignedUrl(filePath, ttlMinutes = 15) {
    return this.request(`/signed-url`, { method: 'POST', body: JSON.stringify({ filePath, ttlMinutes }) });
  }

  // Hugging Face proxy
  hfTextGeneration(prompt, model) {
    return this.request(`/ai/text-generation`, { method: 'POST', body: JSON.stringify({ prompt, model }) });
  }
}