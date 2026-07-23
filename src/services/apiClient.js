const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

class ApiClient {
  constructor() {
    this.apiKey = 'cap_test_demo_key';
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...options.headers
    };

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error?.message || `Erro na API (${response.status})`);
      }

      return data;
    } catch (err) {
      console.error(`API Error ${endpoint}:`, err.message);
      throw err;
    }
  }

  createCharge(chargeData) {
    return this.request('/charges', {
      method: 'POST',
      body: JSON.stringify(chargeData)
    });
  }

  getCharges() {
    return this.request('/charges', { method: 'GET' });
  }

  getCharge(id) {
    return this.request(`/charges/${id}`, { method: 'GET' });
  }

  payCharge(id, webhookUrl = '') {
    return this.request(`/charges/${id}/pay`, {
      method: 'POST',
      body: JSON.stringify({ webhook_url: webhookUrl })
    });
  }

  requestPayout(payoutData) {
    return this.request('/payouts', {
      method: 'POST',
      body: JSON.stringify(payoutData)
    });
  }
}

export const apiClient = new ApiClient();
